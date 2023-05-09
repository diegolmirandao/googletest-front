import { Grid, MenuItem, Card, CardHeader, CardContent, CardActions, Collapse, Select, FormControl, TextField, Button, IconButton } from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { EFilterOperator } from 'src/enums/FilterOperator';
import { ITableFilter } from 'src/interfaces/tableFilter';
import filterOperators, { FilterOperator } from 'src/config/filter';
import LoadingButton from '@mui/lab/LoadingButton'
import { FilterOperatorType } from 'src/types/FilterOperatorType';
import { FilterType } from 'src/types/FilterType';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

// ** Icon Imports
import ChevronUpIcon from 'mdi-material-ui/ChevronUp'
import ChevronDownIcon from 'mdi-material-ui/ChevronDown'
import DeleteIcon from 'mdi-material-ui/Delete'
import MagnifyIcon from 'mdi-material-ui/Magnify'
import PlusIcon from 'mdi-material-ui/Plus'

type TableFilterType = ITableFilter & {
    operator: FilterOperatorType
    value?: string | number | boolean | Dayjs
}

export interface FiltersFormValues {
    filters: TableFilterType[]
}

interface IProps {
    filters: ITableFilter[],
    onSubmit: (data: FiltersFormValues) => void
}

const TableFilter = (props: IProps) => {
    const { filters, onSubmit } = props
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const { t } = useTranslation()

    const firstFilter = filters[0]
    const {
        reset,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors }
    } = useForm<FiltersFormValues>({
        defaultValues: {
            filters: []
        },
        mode: 'onChange',
    })
    const { fields, append, remove, update } = useFieldArray<FiltersFormValues>({
        control,
        name: "filters"
    });

    useEffect(() => {
        appendFilter()
    }, [])

    const appendFilter = () => {
        append({
            field: firstFilter.field,
            text: firstFilter.text,
            type: firstFilter.type,
            operator: getFilterTypeOperators(firstFilter.type)[0].operator,
        })
    }

    const getFilterTypeOperators = (filterType: FilterType): FilterOperator[] => {
        return filterOperators.filter(filterOperator => filterOperator.types.includes(filterType))
    }

    const renderFilterFormControl = (filter: ITableFilter, fieldArrayIndex: number): React.ReactNode => {
        switch (filter.type) {
            case 'string':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${fieldArrayIndex}.value`}
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
                )
            case 'numeric':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${fieldArrayIndex}.value`}
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
                )
            case 'boolean':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${fieldArrayIndex}.value`}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                >
                                    <MenuItem value='1'>Verdadero</MenuItem>
                                    <MenuItem value='0'>Falso</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                )
            case 'date':
                return (
                    <FormControl fullWidth size="small">
                        <Controller
                            name={`filters.${fieldArrayIndex}.value`}
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
                )
        }
    }

    const handleOnChangeFilter = (value: string, fieldArrayIndex: number) => {
        const newFilter = filters.find(filter => filter.field == value)
        update(fieldArrayIndex, {
            field: newFilter?.field as string,
            text: newFilter?.text as string,
            type: newFilter?.type as FilterType,
            operator: getFilterTypeOperators(newFilter?.type as FilterType)[0].operator
        })
    }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                                        onChange={(e) => handleOnChangeFilter(e.target.value, index)}
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
                            <Button variant='outlined' onClick={appendFilter} startIcon={<PlusIcon fontSize='small' />}>
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