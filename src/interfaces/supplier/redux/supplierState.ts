import { MSupplierAddress } from 'src/models/supplier/address';
import { MSupplier } from 'src/models/supplier/supplier';
import { MSupplierContact } from 'src/models/supplier/contact';

export interface ISupplierState {
  suppliers: MSupplier[];
  filteredSuppliers: MSupplier[] | null;
  cursor: string | null;
  filteredCursor: string | null;
  currentSupplier: MSupplier | undefined;
  currentSupplierContact: MSupplierContact | undefined;
  currentSupplierAddress: MSupplierAddress | undefined;
};