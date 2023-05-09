import { MPermission } from '../../models/user/permission';

export interface IGroupedPermission {
    [key: string]: MPermission[]
}