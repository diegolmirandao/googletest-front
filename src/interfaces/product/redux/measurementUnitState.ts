import { MMeasurementUnit } from 'src/models/product/measurementUnit';

export interface IMeasurementUnitState {
  measurementUnits: MMeasurementUnit[];
  currentMeasurementUnit: MMeasurementUnit | undefined;
};