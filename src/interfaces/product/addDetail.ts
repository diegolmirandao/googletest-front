import { IAddImage } from "../image/add";
import { IAddDescription } from "./addDescription";
import { IAddUpdateProductDetailCost } from "./addUpdateDetailCost";
import { IAddUpdateProductDetailPrice } from "./addDetailPrice";
import { IAddProductDetailVariant } from "./addDetailVariant";

export interface IAddProductDetail {
    status: boolean;
    codes: string[];
    descriptions: IAddDescription[];
    images: IAddImage[];
    variants: IAddProductDetailVariant[];
    costs: IAddUpdateProductDetailCost[];
    prices: IAddUpdateProductDetailPrice[];
}