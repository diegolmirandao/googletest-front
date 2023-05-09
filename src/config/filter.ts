import { FilterOperatorType } from "src/types/FilterOperatorType"
import { FilterType } from "src/types/FilterType"

export type FilterOperator = {
    operator: FilterOperatorType,
    types: FilterType[]
}

const filterOperators: FilterOperator[] = [
    {
        operator: 'contain',
        types: [
            'string'
        ]
    },
    {
        operator: '=',
        types: [
            'string', 'numeric', 'select', 'date'
        ]
    },
    {
        operator: '!=',
        types: [
            'string', 'numeric', 'select', 'date'
        ]
    },
    {
        operator: '<',
        types: [
            'numeric', 'date'
        ]
    },
    {
        operator: '>',
        types: [
            'numeric', 'date'
        ]
    },
    {
        operator: '=<',
        types: [
            'numeric', 'date'
        ]
    },
    {
        operator: '=>',
        types: [
            'numeric', 'date'
        ]
    },
    {
        operator: 'startsWith',
        types: [
            'string'
        ]
    },
    {
        operator: 'endsWith',
        types: [
            'string'
        ]
    },
    {
        operator: 'is',
        types: [
            'boolean'
        ]
    }
]

export default filterOperators