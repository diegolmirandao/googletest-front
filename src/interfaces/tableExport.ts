import { ExportFormatType } from "src/types/ExportFormatType"

export interface ITableExportColumn {
    field: string
    text: string
}

export interface ITableExport {
    format: ExportFormatType;
    columns: string[];
}