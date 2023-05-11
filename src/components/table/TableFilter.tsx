import { Grid, MenuItem, Card, CardHeader, CardContent, CardActions, Collapse, Select, FormControl, TextField, Button, IconButton } from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { EFilterOperator } from 'src/enums/FilterOperator';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import filterOperators, { FilterOperator } from 'src/config/filter';
import LoadingButton from '@mui/lab/LoadingButton'
import { FilterType } from 'src/types/FilterType';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

// ** Icon Imports
import ChevronUpIcon from 'mdi-material-ui/ChevronUp'
import ChevronDownIcon from 'mdi-material-ui/ChevronDown'
import DeleteIcon from 'mdi-material-ui/Delete'
import MagnifyIcon from 'mdi-material-ui/Magnify'
import PlusIcon from 'mdi-material-ui/Plus'
import { t } from 'i18next';

export interface FiltersFormValues {
    filters: ITableFilterApplied[]
}

interface IProps {
    filters: ITableFilter[],
    defaultFiltersApplied?: ITableFilterApplied[],
    onSubmit: (filters: ITableFilterApplied[]) => void
}

const TableFilter = (props: IProps) => {
    const { filters, defaultFiltersApplied, onSubmit } = props;
    const [collapsed, setCollapsed] = useState<boolean>(true);

    const getFilterTypeOperators = (filterType: FilterType): FilterOperator[] => {
        return filterOperators.filter(filterOperator => filterOperator.types.includes(filterType));
    };

    const defaultFilter: ITableFilterApplied = {
        field: filters[0].field,
        text: filters[0].text,
        type: filters[0].type,
        options: filters[0].options,
        operator: getFilterTypeOperators(filters[0].type)[0].operator,
        value: ''
    };

    const defaultValues: FiltersFormValues = defaultFiltersApplied ? { filters: defaultFiltersApplied } : { filters: [defaultFilter]};

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FiltersFormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const {
        fields,
        append,
        remove,
        update
    } = useFieldArray({
        control,
        name: "filters"
    });

    /**
     * Filter field change handler
     * @param value value of the new selected field
     * @param index index of the filter
     */
    const handleFilterFieldChange = (value: string, index: number) => {
        const newFilter = filters.find(filter => filter.field == value)!;
        update(index, {
            field: newFilter.field,
            text: newFilter.text,
            type: newFilter.type,
            options: newFilter.options,
            operator: getFilterTypeOperators(newFilter.type)[0].operator,
            value: ''
        })
    };

    /**
     * Render filter value field
     * @param filter Filter applied
     * @param index index of filter
     * @returns filter field component based on type
     */
    const renderFilterFormControl = (filter: ITableFilter, index: number): React.ReactNode => {
        switch (filter.type) {
            case 'string':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${index}.value`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    onChange={onChange}
                                    size="small"
                                />
                            )}
                        />
                    </FormControl>
                );
            case 'numeric':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${index}.value`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    type='number'
                                    value={value}
                                    onChange={onChange}
                                    size="small"
                                />
                            )}
                        />
                    </FormControl>
                );
            case 'boolean':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${index}.value`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                >
                                    {filter.options?.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                );
            case 'select':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${index}.value`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                >
                                    {filter.options?.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                );
            case 'date':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${index}.value`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DatePicker
                                    value={value}
                                    format='DD-MM-YYYY'
                                    onChange={(value) => (value as Dayjs).format('YYYY-MM-DD')}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            )}
                        />
                    </FormControl>
                );
        }
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    title={t('filters')}
                    sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
                    action={
                        <IconButton
                            size='small'
                            aria-label='collapse'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => setCollapsed(!collapsed)}
                            >
                            {!collapsed ? <ChevronDownIcon fontSize='small' /> : <ChevronUpIcon fontSize='small' />}
                        </IconButton>
                    }
                />
                <Collapse in={collapsed}>
                    <form onSubmit={handleSubmit((data) => onSubmit(data.filters))}>
                        <CardContent sx={{ pt: 0 }}>
                            {fields.map((item, index) => (
                                <Grid container spacing={6} sx={{mb: 2}} key={item.id}>
                                    <Grid item sm={3} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Controller
                                                name={`filters.${index}.field`}
                                                control={control}
                                                render={({ field: { value } }) => (
                                                    <Select 
                                                        onChange={(e) => handleFilterFieldChange(e.target.value, index)}
                                                        value={value}
                                                    >
                                                        {filters.map(filter => (
                                                            <MenuItem key={filter.field} value={filter.field}>{filter.text}</MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={3} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Controller
                                                name={`filters.${index}.operator`}
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Select
                                                        onChange={onChange}
                                                        defaultValue={getFilterTypeOperators(item.type)[0].operator}
                                                        value={value}
                                                    >
                                                        {getFilterTypeOperators(item.type).map(filterOperator => (
                                                            <MenuItem key={filterOperator.operator} value={filterOperator.operator} >{t(EFilterOperator[filterOperator.operator])}</MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={5} xs={12}>
                                        { renderFilterFormControl(item, index) }
                                    </Grid>
                                    <Grid item sm={1} xs={12}>
                                        <Button variant='outlined' color='error' onClick={() => remove(index)}><DeleteIcon /></Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'right' }}>
                            <Button variant='outlined' onClick={() => append(defaultFilter)} startIcon={<PlusIcon fontSize='small' />}>
                                {t('add_filter')}
                            </Button>
                            <LoadingButton type='submit' variant='contained' sx={{ mr: 3 }} loading={false} startIcon={<MagnifyIcon fontSize='small' />}>
                                {t('search')}
                            </LoadingButton>
                        </CardActions>
                    </form>
                </Collapse>
            </Card>
        </Grid>
    )
}

export default TableFilter;