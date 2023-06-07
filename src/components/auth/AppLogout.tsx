import { useEffect, useCallback } from "react";
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import { logoutAction } from "../../redux/actions/auth";
import { useNavigate, useParams } from 'react-router-dom'

const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

interface IProps {
    children: JSX.Element
}

const AppLogout = ({ children }: IProps) => {
    const { authReducer } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { tenantDomain } = useParams()

    let timer: number | undefined

    const handleLogoutTimer = () => {
        timer = window.setTimeout(() => {
          resetTimer();
          for (const item of events) {
            window.removeEventListener(item, eventsHandlerCallback);
          }
          logout();
        }, 1000 * 60 * 60 * 4);
    };

    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    const eventsHandlerCallback = useCallback(() => {
        resetTimer();
        handleLogoutTimer();
    }, [])

    const logout = async () => {
        await dispatch(logoutAction())
        
        navigate(`/${tenantDomain}/login`)
    };

    useEffect(() => {
        if (authReducer.user) {
            for (const item of events) {
                window.addEventListener(item, eventsHandlerCallback);
            }
        }
    }, [authReducer.user]);

    return children
}

export default AppLogout