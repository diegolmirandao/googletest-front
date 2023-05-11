import FilterQueryType from 'src/types/FilterQueryType';
import { IPagination } from './pagination';
import SortQueryType from 'src/types/SortQueryType';

export interface IListQueryParam extends IPagination {
    filters?: FilterQueryType;
    sorts?: SortQueryType;
}