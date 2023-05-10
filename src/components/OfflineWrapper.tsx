import { AxiosResponse } from "axios";
import { useEffect, useCallback, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import axios from "../config/axios";
import { dequeue } from "../redux/reducers/offline";
import { toast } from "react-toastify";
import { t } from "i18next";

interface IProps {
    children: JSX.Element
}

const OfflineWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();
    const { offlineReducer: { queue } } = useAppSelector((state) => state);
    const queueRef = useRef(queue)
    const processQueue = async () => {
        if (queueRef.current.length) {
            let someFailed = false;

            const requests = queueRef.current.map(async queueRequest => {
                try {
                    const {data: response}: AxiosResponse<any> = await axios({
                        url: queueRequest.requestConfig.url,
                        method: queueRequest.requestConfig.method,
                        data: queueRequest.requestConfig.data ? JSON.parse(queueRequest.requestConfig.data) : null
                    });
            
                    return {
                        action: {
                            type: queueRequest.actionType,
                            payload: response
                        },
                        queueRequest
                    }
                } catch (error) {
                    return Promise.reject({
                        error,
                        queueRequest
                    });
                }
            })

            const queueResponses = await Promise.allSettled(requests);

            queueResponses.map(response => {
                let queue;
                let mustDequeue = true;

                if (response.status == 'fulfilled') {
                    dispatch(response.value?.action);
                    queue = response.value?.queueRequest;
                } else {
                    if (response.reason?.error?.code === 'ERR_NETWORK') {
                        mustDequeue = false;
                    }
                    queue = response.reason?.queueRequest;
                    someFailed = true;
                }

                if (mustDequeue) {
                    dispatch(dequeue(queue));
                }
                
            })

            if (someFailed) {
                toast.error(t('request_added_to_queue'));
            } else {
                toast.success(t('requests_processed_succesfully'));
            }
        }
    }
    const processQueueCallback = useCallback(() => {
        processQueue();
    }, []);
    
    useEffect(() => {
        const process = async () => {
            await processQueue();
        }
        process();

        addEventListener('online', processQueueCallback);

        return () => {
            removeEventListener('online', processQueueCallback);
        }
    }, [])

    useEffect(() => {
        queueRef.current = queue
    }, [queue])
    
    return children;
}

export default OfflineWrapper;