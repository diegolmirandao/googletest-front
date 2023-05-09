import { IPermissionGroup } from "./permissionGroup";

export interface IPermission {
    id: number;
    name: string;
    description: string;
    permission_group_id: number;
    created_at: string;
    updated_at: string;
    permission_group: IPermissionGroup;
}