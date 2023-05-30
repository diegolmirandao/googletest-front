import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { syncEnded, resetSync, setSyncStarted } from "../redux/reducers/sync";
import { Id, toast } from "react-toastify";
import { syncAction } from "src/redux/actions/sync";
import { unwrapResult } from '@reduxjs/toolkit';
import { useTranslation } from "react-i18next";

interface IProps {
    children: JSX.Element
}

const SyncWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const { syncReducer: { syncDone, syncStarted }, authReducer: { user }, offlineReducer: { isOnline } } = useAppSelector((state) => state);
    const [cursor, setCursor] = useState<string | null>(null);
    const loadingToastId = useRef<Id | undefined>(undefined);

    useEffect(() => {
        if (user && !syncDone && isOnline) {
            if (!syncStarted) {
                loadingToastId.current = toast.loading(t('synchronizing_data'));

                dispatch(setSyncStarted(true));
            }

            sync();
        } else {
            dispatch(resetSync());
        }
    }, [user, cursor, isOnline])

    const sync = async () => {
        try {
            const syncResponse = await dispatch(syncAction({deviceId: '993dad33-f06a-40aa-b88e-31d47c3c2356', cursor: cursor})).then(unwrapResult);
            const { data } = syncResponse
            
            for (const key in data) {
                const actionType = key.concat('/sync');
                // @ts-ignore
                const payload = data[key];
                const action = { type: actionType, payload: payload };

                dispatch(action);
            }

            if (syncResponse.next_cursor) {
                setCursor(syncResponse.next_cursor);
            } else {
                dispatch(syncEnded());

                toast.dismiss(loadingToastId.current);
                toast.success(t('synchronized_data'));
            }
        } catch (error) {
            dispatch(syncEnded());

            toast.dismiss(loadingToastId.current);
            toast.error(t('synchronization_failed'));
        }
    };
    
    return children;
}

export default SyncWrapper;