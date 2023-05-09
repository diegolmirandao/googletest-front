import { AxiosResponse } from "axios";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { initEnded } from "../redux/reducers/init";
import { toast } from "react-toastify";
import { initAction } from "src/redux/actions/init";
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from "react-i18next";

interface IProps {
    children: JSX.Element
}

const InitWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();
    const { initReducer: { initDone }, authReducer: { user } } = useAppSelector((state) => state);
    const { t } = useTranslation()

    useEffect(() => {
        if (user && !initDone) {
            toast.promise(init(), {
                pending: {
                    render(){
                        return t('initializing_data')
                    }
                },
                success: {
                    render(){
                        return t('initialed_data')
                    },
                },
                error: {
                    render(){
                        return t('initialed_data_failure')
                    }
                }
            });
        }
    }, [user])

    const init = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const initResponse = await dispatch(initAction()).then(unwrapResult);

                for (const key in initResponse) {
                    const actionType = key.concat('/get');
                    // @ts-ignore
                    const payload = initResponse[key];
                    const action = { type: actionType, payload: payload };

                    dispatch(action);
                }
                
                dispatch(initEnded());
    
                resolve(initResponse);
            } catch (error) {
                reject(error);
            }
        });
    };
    
    return children;
}

export default InitWrapper;