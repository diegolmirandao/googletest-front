export interface IResponseCursorPagination<T> {
    data: T[];
    path: string;
    per_page: number;
    next_cursor: null | string;
    next_page_url: null | string;
    prev_cursor: null | string;
    prev_page_url: null | string;
}
