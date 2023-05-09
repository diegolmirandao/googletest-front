import { GridSortDirection } from "@mui/x-data-grid-pro"

type SortQueryType = {
    [name: string]: string | GridSortDirection
}

export default SortQueryType