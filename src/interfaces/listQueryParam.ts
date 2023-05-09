import FilterQueryType from 'src/types/FilterQueryType';
import { IPagination } from './pagination';

export interface IListQueryParam extends IPagination {
    filters?: FilterQueryType;
    sorts?: FilterQueryType
}