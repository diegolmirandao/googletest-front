import { ICity } from "../location/city";
import { IZone } from "../location/zone";

export interface ICustomerAddress {
    id: number;
    customer_id: number;
    zone_id: number;
    name: string;
    phone: string;
    address: string;
    reference: string;
    lat: number;
    lng: number;
    city: ICity;
    zone: IZone;
    created_at: string;
    updated_at: string;
}