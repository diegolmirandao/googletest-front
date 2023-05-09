import { ICurrency } from "../interfaces/currency/currency";

export class MCurrency {
    public id: number;
    public name: string;
    public code: string;
    public abbreviation: string;
    public main: boolean;
    public exchangeRate: number;
    public createdBy: number;
    public updatedBy: number;
    public createdAt: string;
    public updatedAt: string;

    constructor(currency: ICurrency) {
        this.id = currency.id;
        this.name = currency.name;
        this.code = currency.code;
        this.abbreviation = currency.abbreviation;
        this.main = currency.main;
        this.exchangeRate = currency.exchange_rate;
        this.createdBy = currency.created_by;
        this.updatedBy = currency.updated_by;
        this.createdAt = currency.created_at;
        this.updatedAt = currency.updated_at;
    }
};