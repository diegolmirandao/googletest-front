import FilterQueryType from 'src/types/FilterQueryType';
import { IPagination } from './pagination';
import SortQueryType from 'src/types/SortQueryType';

export interface IListQueryParam {
    filters?: FilterQueryType | null;
    sorts?: SortQueryType | null;
}