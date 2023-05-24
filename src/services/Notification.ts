import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import config from "src/config";
import axios from '../config/axios';

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo;
    }
}

const createEchoInstance = () => {
    if (!window.Echo) {
        window.Pusher = Pusher;
    
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: config.pusherAppKey,
            cluster: config.pusherAppCluster,
            forceTLS: true,
            authorizer: (channel: any, options: any) => {
                return {
                    authorize: (socketId: any, callback: any) => {
                        axios.post(`${config.baseUrl}/broadcasting/auth`, {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                    }
                };
            },
        });   
    }
}

const echoInstanceCreated = (): boolean => {
    return !!window.Echo
}

export { createEchoInstance, echoInstanceCreated }
