import { ISaleInstalment } from 'src/interfaces/sale/instalment';

export class MSaleInstalment {
    public id: number;
    public saleId: number;
    public number: number;
    public expiresAt: string;
    public amount: number;
    public createdAt: string;
    public updatedAt: string;

    constructor(instalment: ISaleInstalment) {
        this.id = instalment.id;
        this.saleId = instalment.sale_id;
        this.number = instalment.number;
        this.expiresAt = instalment.expires_at;
        this.amount = instalment.amount;
        this.createdAt = instalment.created_at;
        this.updatedAt = instalment.updated_at;
    }
};