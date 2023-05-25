import { AxiosResponse } from "axios";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { syncEnded, resetSync } from "../redux/reducers/sync";
import { toast } from "react-toastify";
import { syncAction } from "src/redux/actions/sync";
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from "react-i18next";

interface IProps {
    children: JSX.Element
}

const SyncWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();
    const { syncReducer: { syncDone }, authReducer: { user } } = useAppSelector((state) => state);
    const { t } = useTranslation()

    useEffect(() => {
        if (user && !syncDone) {
            toast.promise(sync(), {
                pending: {
                    render(){
                        return t('synchronizing_data')
                    }
                },
                success: {
                    render(){
                        return t('synchronized_data')
                    },
                },
                error: {
                    render(){
                        return t('synchronization_failed')
                    }
                }
            });
        } else {
            dispatch(resetSync());
        }
    }, [user])

    const sync = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const syncResponse = await dispatch(syncAction('993dad33-f06a-40aa-b88e-31d47c3c2356')).then(unwrapResult);
                const { data } = syncResponse
                const { next_cursor: nextCursor } = syncResponse
                
                for (const key in data) {
                    const actionType = key.concat('/sync');
                    // @ts-ignore
                    const payload = data[key];
                    const action = { type: actionType, payload: payload };

                    dispatch(action);
                }
                
                dispatch(syncEnded());
    
                resolve(syncResponse);
            } catch (error) {
                reject(error);
            }
        });
    };
    
    return children;
}

export default SyncWrapper;