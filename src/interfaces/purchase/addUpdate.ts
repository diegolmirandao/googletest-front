import { IAddPurchaseProduct } from "./addProduct";
import { IUpdatePurchaseInstalment } from "./updateInstalment";
import { IAddUpdatePurchasePayment } from "./addUpdatePayment";
import { Dayjs } from "dayjs";

export interface IAddUpdatePurchase {
    supplier_id: number;
    currency_id: number;
    establishment_id: number;
    warehouse_id: number;
    document_type_id: number;
    payment_term_id: number;
    purchased_at: Dayjs | null;
    expires_at: Dayjs | null;
    comments: string;
    products: IAddPurchaseProduct[];
    payments: IAddUpdatePurchasePayment[];
    instalments: IUpdatePurchaseInstalment[];
};