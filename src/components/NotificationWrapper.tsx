import { useEffect } from "react";
import { useAppDispatch } from "../hooks/redux";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { deleteCustomer } from "src/redux/reducers/customer";
import { MCustomer } from "src/models/customer/customer";
import config from "src/config";
import { showCustomerAction } from "src/redux/actions/customer";

interface IProps {
    children: JSX.Element
}

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo;
    }
}

interface INotification {
    id: number;
}

const NotificationWrapper = ({ children }: IProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        window.Pusher = Pusher;
    
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: config.pusherAppKey,
            cluster: config.pusherAppCluster,
            authEndpoint: `${config.baseUrl}/broadcasting/auth`,
            forceTLS: true,
            auth: {
                withCredentials: true
            }
        });
    
        window.Echo.channel('99353b3a-5e0e-4847-b68a-ef33825b6e24').listen('.customer.created', function(data: INotification) {
            console.log(data);
            dispatch(showCustomerAction(data.id));
        });
        window.Echo.channel('99353b3a-5e0e-4847-b68a-ef33825b6e24').listen('.customer.updated', function(data: INotification) {
            console.log(data);
            dispatch(showCustomerAction(data.id));
        });
        window.Echo.channel('99353b3a-5e0e-4847-b68a-ef33825b6e24').listen('.customer.deleted', function(data: INotification) {
            console.log(data);
            dispatch(deleteCustomer(data.id));
        });
    }, []);
    
    return children;
}

export default NotificationWrapper;