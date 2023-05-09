import { useEffect } from "react";
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import { logoutAction } from "../../redux/actions/auth";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

interface IProps {
    children: JSX.Element
}

const ProtectedPage = ({ children }: IProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authReducer: { user } } = useAppSelector((state) => state)

    useEffect(() => {
        if (!user && location.pathname !== '/login') {
            navigate('/login')
        }
    }, [user]);

    return children
}

export default ProtectedPage