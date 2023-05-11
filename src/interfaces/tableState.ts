import { GridColDef, GridColumnVisibilityModel, GridSortModel } from "@mui/x-data-grid-pro";
import { ITableExport } from "src/interfaces/tableExport";
import { ITableFilterApplied } from "./tableFilter";

type TableDefinition = {
    columns: GridColDef[] | undefined;
    visibility: GridColumnVisibilityModel | undefined;
    filters: ITableFilterApplied[] | undefined;
    sorts: GridSortModel | undefined;
    export: ITableExport | undefined;
}

export default interface ITableState {
    users: TableDefinition
}