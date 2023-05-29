import { IAddSaleProduct } from "./addProduct";
import { IUpdateSaleInstalment } from "./updateInstalment";
import { IAddUpdateSalePayment } from "./addUpdatePayment";
import { Dayjs } from "dayjs";

export interface IAddUpdateSale {
    customer_id: number;
    currency_id: number;
    establishment_id: number;
    point_of_sale_id: number;
    warehouse_id: number;
    seller_id: number;
    document_type_id: number;
    payment_term_id: number;
    billed_at: Dayjs | null;
    expires_at: Dayjs | null;
    comments: string;
    products: IAddSaleProduct[];
    payments: IAddUpdateSalePayment[];
    instalments: IUpdateSaleInstalment[];
};