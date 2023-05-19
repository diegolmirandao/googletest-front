import { List, ListItem } from "@mui/material"
import { FiltersFormValues } from "src/components/table/TableFilter";
import { GridSortModel } from '@mui/x-data-grid'
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import IResponseData from "src/interfaces/responseData";
import i18n from "i18next";
import { esES } from '@mui/x-data-grid-pro';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableFilterApplied } from "src/interfaces/tableFilter";

export const displayErrors = (e: unknown) => {
    let errorMessage: JSX.Element | string | undefined;
    const error = e as AxiosError<IResponseData>;

    switch (error.response?.status) {
        case 422:
            const errors = error.response?.data?.errors;
            const errorValues = errors ? Object.entries(errors).map(([key, value]) => value) : null;
            const validationErrors = errorValues?.map(error => error);
            
            errorMessage = (
                <List sx={{ py: 0 }}>
                    {validationErrors?.map((validationError, i) => {
                        return <ListItem key={i} sx={{ py: '5px', fontSize: '14px' }} divider disableGutters>
                            {validationError}
                        </ListItem>
                    })}
                </List>
            );

            break;
        default:
            errorMessage = error.response?.data?.message;
    }

    if (error.code != 'ERR_NETWORK') {
        toast.error(errorMessage, { style: { width: 'auto' }, autoClose: 5000 });
    }
};

export const generateFilterQueryParams = (filters: ITableFilterApplied[] | undefined): FilterQueryType | null => {
    let queryParams: FilterQueryType = {};

    filters?.map(filter => {
        let operatorParamKey = '';
        let filterValue = '';

        switch (filter.operator) {
            case 'is':
                queryParams[`${filter.field}`] = filter.value ? 1 : 0;
                break;
            case 'contains':
                filterValue = String(filter.value).replace(' ', '%');
                operatorParamKey = `${filter.field}[like]`;
                queryParams[operatorParamKey] = operatorParamKey in queryParams ? queryParams[operatorParamKey] : `%${filterValue}%`;
                break;
            case 'startsWith':
                filterValue = String(filter.value).replace(' ', '%');
                operatorParamKey = `${filter.field}[like]`;
                queryParams[operatorParamKey] = operatorParamKey in queryParams ? queryParams[operatorParamKey] : `${filter.value!}%`;
                break;
            case 'endsWith':
                filterValue = String(filter.value).replace(' ', '%');
                operatorParamKey = `${filter.field}[like]`;
                queryParams[operatorParamKey] = operatorParamKey in queryParams ? queryParams[operatorParamKey] : `%${filter.value!}`;
                break;
            default:
                operatorParamKey = `${filter.field}[operator]`;

                queryParams[operatorParamKey] = operatorParamKey in queryParams ? queryParams[operatorParamKey] : filter.operator;
                queryParams[`${filter.field}[value]`] = filter.value!;
                break;
        }
    });

    return (filters && filters!.length > 0) ? queryParams : null;
}

export const generateSortQueryParams = (sortModel: GridSortModel | undefined): SortQueryType | null => {
    let sortQueryParams: SortQueryType = {}

    sortModel?.map(sort => {
        sortQueryParams[`f_params[orderBy][field]`] = sort.field;
        sortQueryParams[`f_params[orderBy][type]`] = sort.sort;
    });

    return (sortModel && sortModel!.length > 0) ? sortQueryParams : null;
}

export const setDataGridLocale = () => {
    switch (i18n.language) {
        case 'es':
            return esES.components.MuiDataGrid.defaultProps.localeText;
        default:
            return esES.components.MuiDataGrid.defaultProps.localeText;
    }
}