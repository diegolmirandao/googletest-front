import { FilterOperatorType } from 'src/types/FilterOperatorType';
import { FilterType } from '../types/FilterType';
import { Dayjs } from 'dayjs';

interface ITableFilterOption {
    value: number,
    text: string
}

export interface ITableFilter {
    field: string
    text: string
    type: FilterType,
    options?: ITableFilterOption[]
}

export interface ITableFilterApplied extends ITableFilter {
    operator: FilterOperatorType
    value: string | number | boolean | Dayjs
}