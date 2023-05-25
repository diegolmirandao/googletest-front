import { IImage } from "../image/image";
import { IBrand } from "./brand";
import { IProductCategory } from "./category";
import { IDescription } from "./description";
import { IProductDetail } from "./detail";
import { IMeasurementUnit } from "./measurementUnit";
import { IProductProperty } from "./productProperty";
import { IProductSubcategory } from "./subcategory";
import { IProductType } from "./type";

export interface IProduct {
    id: number;
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
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    codes: string[];
    category: IProductCategory;
    subcategory: IProductSubcategory;
    brand: IBrand;
    type: IProductType;
    measurement_unit: IMeasurementUnit;
    properties: IProductProperty[];
    descriptions: IDescription[];
    details?: IProductDetail[];
    images: IImage[];
}