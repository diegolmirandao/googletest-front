import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { TypedDispatch, RootState } from '../redux';

export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
