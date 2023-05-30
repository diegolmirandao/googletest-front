import { IBusiness } from 'src/interfaces/business/business';

export class MBusiness {
    public id: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(business: IBusiness) {
        this.id = business.id;
        this.name = business.name;
        this.createdAt = business.created_at;
        this.updatedAt = business.updated_at;
    }
};