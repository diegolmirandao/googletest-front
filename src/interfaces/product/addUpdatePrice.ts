import { IAddUpdateProductDetailCost } from "./addUpdateDetailCost";
import { IAddUpdateProductDetailPrice } from "./addDetailPrice";

export interface IAddUpdateProductPrice {
    costs: IAddUpdateProductDetailCost[];
    prices: IAddUpdateProductDetailPrice[];
}