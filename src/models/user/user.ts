import { MPermission } from './permission';
import { MRole } from './role';
import { IUser } from '../../interfaces/user/user';

export class MUser {
    public id: number;
    public name: string;
    public username: string;
    public email: string;
    public emailVerifiedAt: null;
    public status: boolean;
    public createdAt: string;
    public updatedAt: string;
    public deletedAt: null | string;
    public roles: MRole[];
    public roleId: number;
    public deviceId: string;
    public permissions: MPermission[];

    constructor(user: IUser) {
        this.id = user.id;
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.emailVerifiedAt = user.email_verified_at;
        this.status = user.status;
        this.createdAt = user.created_at;
        this.updatedAt = user.updated_at;
        this.deletedAt = user.deleted_at;
        this.roles = user.roles.map(role => new MRole(role));
        this.roleId = user.role_id;
        this.deviceId = user.device_id;
        this.permissions = user.permissions.map(permission => new MPermission(permission));
    }
}
