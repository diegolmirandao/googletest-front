import { IPermissionGroup } from '../../interfaces/user/permissionGroup';

export class MPermissionGroup {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(permissionGroup: IPermissionGroup) {
        this.id = permissionGroup.id;
        this.name = permissionGroup.name;
        this.createdAt = permissionGroup.created_at;
        this.updatedAt = permissionGroup.updated_at;
    }
}
