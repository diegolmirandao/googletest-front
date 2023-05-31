export interface IPurchaseInstalment {
    id: number;
    purchase_id: number;
    number: number;
    expires_at: string;
    amount: number;
    created_at: string;
    updated_at: string;
};