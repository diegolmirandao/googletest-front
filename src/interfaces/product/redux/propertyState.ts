import { MProperty } from 'src/models/product/property';
import { MPropertyOption } from 'src/models/product/propertyOption';

export interface IPropertyState {
  properties: MProperty[];
  currentProperty: MProperty | undefined;
  currentPropertyOption: MPropertyOption | undefined;
};