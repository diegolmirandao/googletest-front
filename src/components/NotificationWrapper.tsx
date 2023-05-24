import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createEchoInstance, echoInstanceCreated } from "src/services/Notification";
import { showUserAction } from "src/redux/actions/user";
import { showCustomerAction } from "src/redux/actions/customer";
import { unwrapResult } from '@reduxjs/toolkit';

interface IProps {
    children: JSX.Element
}

type NotificationType = 'add' | 'update' | 'delete'

interface INotification {
    type: NotificationType;
    model: string;
    data: any;
}

const actionFunctions = {
    showUserAction,
    showCustomerAction
};

const NotificationWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();
    const { authReducer: { user } } = useAppSelector((state) => state);

    useEffect(() => {
        if (user) {
            createEchoInstance();
    
            window.Echo.private('993c7a4f-4f26-40cb-9600-34b1edfd2e3b').listen('.broadcastEvent', async (notification: INotification) => {
                console.log(notification)
                let actionType = '';

                switch (notification.type) {
                    case 'add':
                    case 'update':
                        const actionName = `show${notification.model}Action`
                        actionType = `${notification.model.toLowerCase()}/${notification.type}/fulfilled`

                        // @ts-ignore
                        const response = await dispatch(actionFunctions[actionName](notification.data)).then(unwrapResult)
                        // const action = { type: actionType, payload: response };
                        
                        // dispatch(action);
                        
                        break;
                    case 'delete':
                        actionType = `${notification.model.toLowerCase()}/delete/fulfilled`;
                        
                        dispatch({ type: actionType, payload: notification.data });
                        break;
                }
            });
        } else {
            if (echoInstanceCreated()) {
                window.Echo.leaveChannel('993c7a4f-4f26-40cb-9600-34b1edfd2e3b');
            }
        }
    }, [user]);
    
    return children;
}

export default NotificationWrapper;