import { MEstablishment } from 'src/models/establishment';
import { MPointOfSale } from 'src/models/pointOfSale';

export interface IEstablishmentState {
    establishments: MEstablishment[],
    currentEstablishment: MEstablishment | undefined,
    currentPointOfSale: MPointOfSale | undefined
}