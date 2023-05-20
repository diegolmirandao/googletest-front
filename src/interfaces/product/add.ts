import { MVariant } from "src/models/product/variant";
import { IAddImage } from "../image/add";
import { IAddDescription } from "./addDescription";
import { IAddProductDetail } from "./addDetail";
import { IAddProductDetailPrice } from "./addDetailPrice";
import { IAddProductProperty } from "./addProductProperty";

export interface IAddProduct {
    category_id: number;
    subcategory_id: number;
    brand_id: number;
    type_id: number;
    measurement_unit_id: number;
    name: string;
    description: string;
    status: boolean;
    taxed: boolean;
    tax: number;
    percentage_taxed: number;
    codes: string[];
    descriptions: IAddDescription[];
    images: IAddImage[];
    prices: IAddProductDetailPrice[];
    properties: IAddProductProperty[];
    variants: MVariant[];
    details: IAddProductDetail[];
}