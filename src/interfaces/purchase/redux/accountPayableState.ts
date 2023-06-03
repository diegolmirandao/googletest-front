import { MPurchase } from 'src/models/purchase/purchase';

export interface IAccountPayableState {
    accountsPayable: MPurchase[],
    filteredAccountsPayable: MPurchase[] | null;
    cursor: string | null;
    filteredCursor: string | null;
}