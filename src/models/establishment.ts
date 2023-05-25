import { IEstablishment } from 'src/interfaces/establishment/establishment';
import { MBusiness } from './business';
import { MPointOfSale } from './pointOfSale';

export class MEstablishment {
    public id: number;
    public businessId: number;
    public name: string;
    public createdAt: string;
    public updatedAt: string;
    public business: MBusiness;
    public pointsOfSale: MPointOfSale[];

    constructor(establishment: IEstablishment) {
        this.id = establishment.id;
        this.businessId = establishment.business_id;
        this.name = establishment.name;
        this.createdAt = establishment.created_at;
        this.updatedAt = establishment.updated_at;
        this.business = new MBusiness(establishment.business);
        this.pointsOfSale = establishment.points_of_sale.map(pointOfSale => new MPointOfSale(pointOfSale));
    }
};