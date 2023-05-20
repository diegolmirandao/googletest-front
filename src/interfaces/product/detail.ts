import { IImage } from "../image/image";
import { IDescription } from "./description";
import { IProductDetailPrice } from "./detailPrice";
import { IProductDetailStock } from "./detailStock";
import { IProductDetailVariant } from "./detailVariant";
import { IProduct } from "./product";

export interface IProductDetail {
    id: number;
    product_id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    name: string;
    product: IProduct;
    codes: string[];
    prices: IProductDetailPrice[];
    stock: IProductDetailStock[];
    variants: IProductDetailVariant[];
    descriptions: IDescription[];
    images: IImage[];
}