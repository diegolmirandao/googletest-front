import { MBusiness } from 'src/models/business';

export interface IBusinessState {
    businesses: MBusiness[],
    currentBusiness: MBusiness | undefined
}