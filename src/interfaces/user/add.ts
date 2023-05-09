export interface IAddUser {
    name: string;
    username: string;
    email: string;
    password: string;
    role_id: number;
    status: boolean;
    permissions: string[]
}