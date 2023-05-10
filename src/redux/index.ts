import { toast } from 'react-toastify';
import { AnyAction, Middleware } from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import reducer from './reducers';
import { persistReducer, persistStore } from 'redux-persist';
import thunk, { ThunkDispatch } from 'redux-thunk';
import rootReducer from '../redux/reducers'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'
import { enqueue } from './reducers/offline';
import { v4 as uuidv4 } from 'uuid';
import i18n from 'i18next';

const persistConfig = {
    key: 'root',
    storage: createIdbStorage({name: 'cadi', storeName: 'persist'}),
    serialize: false, // Data serialization is not required and disabling it allows you to inspect storage value in DevTools; Available since redux-persist@5.4.0
    deserialize: false, // Required to bear same value as `serialize` since redux-persist@6.0
}

const persistedReducer = persistReducer(persistConfig, reducer)

const offlineMiddleware: Middleware = store => next => action => {
    const payload = action.payload

    if (payload?.code === 'ERR_NETWORK') {
        const actionType = action.type;
        const fullfilledActionType = actionType.replace('rejected', 'fulfilled');

        if (payload.config.method != 'get') {
            // se almacena datos principales del request en la cola para luego hacer un retry cuando vuelva la conexión
            store.dispatch(enqueue({id: uuidv4(), actionType: fullfilledActionType, requestConfig: {
                url: payload.config.url,
                method: payload.config.method,
                data: payload.config.data,
                params: payload.config?.params,
            }}));

            toast.success(i18n.t('request_added_to_queue'))
        }
    }

    next(action);
}

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk, offlineMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export type ReduxState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;

export {Provider as ReduxProvider, store};

export const persistor = persistStore(store)