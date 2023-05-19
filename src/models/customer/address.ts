import { ICustomerAddress } from "src/interfaces/customer/address";
import { MZone } from "../location/zone";
import { MCity } from "../location/city";

export class MCustomerAddress {
    public id: number;
    public customerId: number;
    public zoneId: number;
    public name: string;
    public phone: string;
    public address: string;
    public reference: string;
    public lat: number;
    public lng: number;
    public city: MCity;
    public zone: MZone;
    public createdAt: string;
    public updatedAt: string;

    constructor(address: ICustomerAddress) {
        this.id = address.id;
        this.customerId = address.customer_id;
        this.zoneId = address.zone_id;
        this.name = address.name;
        this.phone = address.phone;
        this.address = address.address;
        this.reference = address.reference;
        this.lat = address.lat;
        this.lng = address.lng;
        this.city = new MCity(address.city);
        this.zone = new MZone(address.zone);
        this.createdAt = address.created_at;
        this.updatedAt = address.updated_at;
    };
};