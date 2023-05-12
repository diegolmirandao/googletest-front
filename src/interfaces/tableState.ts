import { GridColDef, GridColumnVisibilityModel, GridSortModel } from "@mui/x-data-grid-pro";
import { ITableExport } from "src/interfaces/tableExport";
import { ITableFilterApplied } from "./tableFilter";

export interface ITableState {
    columns: GridColDef[] | undefined;
    visibility: GridColumnVisibilityModel | undefined;
    filters: ITableFilterApplied[] | undefined;
    sorts: GridSortModel | undefined;
    export: ITableExport | undefined;
}