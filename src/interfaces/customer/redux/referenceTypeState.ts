import { MCustomerReferenceType } from 'src/models/customer/referenceType';

export interface ICustomerReferenceTypeState {
  customerReferenceTypes: MCustomerReferenceType[];
  currentCustomerReferenceType: MCustomerReferenceType | undefined;
};