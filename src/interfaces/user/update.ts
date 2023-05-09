import { MPermission } from "src/models/user/permission";

export interface IUpdateUser {
    name: string;
    username: string;
    email: string;
    password: string;
    role_id: number;
    status: boolean;
    permissions: string[]
}