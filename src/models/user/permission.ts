import { MPermissionGroup } from './permissionGroup';
import { IPermission } from '../../interfaces/user/permission';

export class MPermission {
    public id: number;
    public name: string;
    public description: string;
    public permissionGroupId: number;
    public createdAt: string;
    public updatedAt: string;
    public permissionGroup: MPermissionGroup;

    constructor(permission: IPermission) {
        this.id = permission.id;
        this.name = permission.name;
        this.description = permission.description;
        this.permissionGroupId = permission.permission_group_id;
        this.createdAt = permission.created_at;
        this.updatedAt = permission.updated_at;
        this.permissionGroup = new MPermissionGroup(permission.permission_group);
    }
}