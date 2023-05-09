export interface ICurrency {
    id: number;
    name: string;
    code: string;
    abbreviation: string;
    main: boolean;
    exchange_rate: number;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
};