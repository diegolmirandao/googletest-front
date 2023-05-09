import { IRole } from '../../interfaces/user/role';
import { MPermission } from './permission';

export class MRole {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;
    public permissions: MPermission[];

    constructor(role: IRole) {
        this.id = role.id;
        this.name = role.name;
        this.createdAt = role.created_at;
        this.updatedAt = role.updated_at;
        this.permissions = role.permissions.map(permission => new MPermission(permission));
    }
}
