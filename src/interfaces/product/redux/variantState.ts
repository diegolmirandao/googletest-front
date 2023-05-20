import { MVariant } from 'src/models/product/variant';
import { MVariantOption } from 'src/models/product/variantOption';

export interface IVariantState {
  variants: MVariant[];
  currentVariant: MVariant | undefined;
  currentVariantOption: MVariantOption | undefined;
};