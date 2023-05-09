import { Dayjs } from "dayjs"

type FilterQueryType = {
    [name: string]: string | number | boolean | Dayjs
}

export default FilterQueryType