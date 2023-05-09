import { IRole } from './role';
import { IPermission } from './permission';

export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at: null;
    status: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
    roles: IRole[]
    role_id: number
    permissions: IPermission[]
}