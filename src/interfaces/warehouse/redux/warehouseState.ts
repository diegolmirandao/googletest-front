import { MWarehouse } from 'src/models/warehouse';

export interface IWarehouseState {
  warehouses: MWarehouse[];
  currentWarehouse: MWarehouse | undefined;
};