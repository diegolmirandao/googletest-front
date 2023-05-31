import { IPurchaseInstalment } from 'src/interfaces/purchase/instalment';

export class MPurchaseInstalment {
    public id: number;
    public purchaseId: number;
    public number: number;
    public expiresAt: string;
    public amount: number;
    public createdAt: string;
    public updatedAt: string;

    constructor(instalment: IPurchaseInstalment) {
        this.id = instalment.id;
        this.purchaseId = instalment.purchase_id;
        this.number = instalment.number;
        this.expiresAt = instalment.expires_at;
        this.amount = instalment.amount;
        this.createdAt = instalment.created_at;
        this.updatedAt = instalment.updated_at;
    }
};