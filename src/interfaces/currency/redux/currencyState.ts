import { MCurrency } from "../../../models/currency"

export interface ICurrencyState {
    currencies: MCurrency[],
    currentCurrency: MCurrency | undefined
}