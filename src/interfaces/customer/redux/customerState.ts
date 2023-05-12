import { MCustomerAddress } from 'src/models/customer/address';
import { MCustomerBillingAddress } from 'src/models/customer/billingAddress';
import { MCustomer } from 'src/models/customer/customer';
import { MCustomerReference } from 'src/models/customer/reference';

export interface ICustomerState {
  customers: MCustomer[];
  filteredCustomers: MCustomer[] | null;
  cursor: string | null;
  currentCustomer: MCustomer | undefined;
  currentCustomerBillingAddress: MCustomerBillingAddress | undefined;
  currentCustomerReference: MCustomerReference | undefined;
  currentCustomerAddress: MCustomerAddress | undefined;
};