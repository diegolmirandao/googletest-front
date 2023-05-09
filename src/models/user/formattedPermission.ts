import { IFormattedPermission } from '../../interfaces/user/formattedPermission';

export class MFormattedPermission {
    public action: string;
    public subject: string;

    constructor(formattedPermission: IFormattedPermission) {
        this.action = formattedPermission.action;
        this.subject = formattedPermission.subject;
    }
}
