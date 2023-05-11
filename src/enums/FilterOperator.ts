import i18n from "i18next";

export enum EFilterOperator {
    '=' = 'is_equal',
    '!=' = 'is_not_equal',
    '<' = 'less_than',
    '>' = 'greater_than',
    '=<' = 'equal_or_less',
    '=>' = 'equal_or_greater',
    'contains' = 'contains',
    'startsWith' = 'starts_with',
    'endsWith' = 'ends_with',
    'is' = 'is',
}