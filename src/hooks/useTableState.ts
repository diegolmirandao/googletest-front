import { ITableState } from "src/interfaces/tableState";

const useTableState = (table: string) => {
    const getTableState = (table: string): ITableState => {
        const storage = localStorage.getItem('tableState');
        const tableState: ITableState = (storage && JSON.parse(storage)[table]) ? JSON.parse(storage)[table] : {
            columns: undefined,
            visibility: undefined,
            filters: undefined,
            sorts: undefined,
            export: undefined,
        };
        return tableState;
    };

    
    const setTableState = (table: string, state: ITableState) => {
        const storage = localStorage.getItem('tableState');
        let tablesState: {[key: string]: ITableState} = storage ? JSON.parse(storage) : {};
        tablesState[table] = state;
        localStorage.setItem('tableState', JSON.stringify(tablesState));
    };

    const tableState: ITableState = getTableState(table);
    
    return [tableState, setTableState] as const;
};

export default useTableState;