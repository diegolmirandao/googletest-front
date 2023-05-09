import ReactDOM from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from "react-router-dom";
import {ReduxProvider, store, persistor} from './redux';
import { AuthProvider } from './context/AuthContext';
import InitWrapper from './components/InitWrapper';
import App from './App';
import 'react-perfect-scrollbar/dist/css/styles.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'src/config/i18n'
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InitWrapper>
          <>
            <AuthProvider>
              <BrowserRouter>
                <App/>
              </BrowserRouter>
            </AuthProvider>
            <ToastContainer autoClose={3000} />
          </>
        </InitWrapper>
      </PersistGate>
    </ReduxProvider>
  </LocalizationProvider>
)