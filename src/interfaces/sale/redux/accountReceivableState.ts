import { MSale } from 'src/models/sale/sale';

export interface IAccountReceivableState {
    accounts: MSale[],
    filteredAccounts: MSale[] | null;
    cursor: string | null;
    filteredCursor: string | null;
}