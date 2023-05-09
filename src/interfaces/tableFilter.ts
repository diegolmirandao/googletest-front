import { FilterType } from '../types/FilterType';

export interface ITableFilter {
    field: string
    text: string
    type: FilterType
}