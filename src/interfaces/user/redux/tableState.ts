import { GridColumnVisibilityModel } from "@mui/x-data-grid-pro";
import { ITableExportColumn } from "src/interfaces/tableExportColumn";
import FilterQueryType from "src/types/FilterQueryType";

type TableDefinition = {
    visibility: GridColumnVisibilityModel
    filters: FilterQueryType | undefined
    sorts: FilterQueryType | undefined
    export: ITableExportColumn | null
}

export default interface ITableState {
    users: TableDefinition
}