import { IAddImage } from "../image/add";
import { IAddDescription } from "./addDescription";
import { IAddProductDetailPrice } from "./addDetailPrice";
import { IAddProductDetailVariant } from "./addDetailVariant";

export interface IAddProductDetail {
    status: boolean;
    codes: string[];
    descriptions: IAddDescription[];
    images: IAddImage[];
    variants: IAddProductDetailVariant[];
    prices: IAddProductDetailPrice[];
}