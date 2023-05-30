import { IPointOfSale } from 'src/interfaces/establishment/pointOfSale';

export class MPointOfSale {
    public id: number;
    public establishmentId: number;
    public number: number;
    public createdAt: string;
    public updatedAt: string;

    constructor(pointOfSale: IPointOfSale) {
        this.id = pointOfSale.id;
        this.establishmentId = pointOfSale.establishment_id;
        this.number = pointOfSale.number;
        this.createdAt = pointOfSale.created_at;
        this.updatedAt = pointOfSale.updated_at;
    }
};