import { MSale } from 'src/models/sale/sale';

export interface IAccountReceivableState {
    accountsReceivable: MSale[],
    filteredAccountsReceivable: MSale[] | null;
    cursor: string | null;
    filteredCursor: string | null;
}