// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addUserAction, deleteUserAction, getUsersAction, updateUserAction } from 'src/redux/actions/user';
import { setCurrentUser, setCursor } from 'src/redux/reducers/user';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddUser } from "src/interfaces/user/add";
import { IUpdateUser } from 'src/interfaces/user/update';
import { IUser } from 'src/interfaces/user/user';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";

// ** MUI Imports
import { GridColDef, GridSortModel, GridRenderCellParams, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridValueFormatterParams, GridColumnOrderChangeParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';
import CustomChip from 'src/components/mui/chip';

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, generateFilterQueryParams, generateSortQueryParams, setDataGridLocale } from 'src/utils/common';
import { formatDate } from 'src/utils/format';
import useRequestParam from "src/hooks/useRequestParams";

// ** Custom components Imports
import TableHeader from 'src/components/table/TableHeader';
import TableFilter, { FiltersFormValues } from 'src/components/table/TableFilter';
import UserAddDialog from './components/AddDialog';
import UserEditDialog from './components/EditDialog';
import UserDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import { ITableState } from "src/interfaces/tableState";

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'name',
    text: 'name'
  },
  {
    field: 'username',
    text: 'username'
  },
  {
    field: 'email',
    text: 'email'
  },
  {
    field: 'roles',
    text: 'role'
  },
  {
    field: 'status',
    text: 'status'
  },
  {
    field: 'created_at',
    text: 'created_at'
  },
  {
    field: 'updated_at',
    text: 'updated_at'
  }
];

/**
 * User section index page
 * @returns User page component
 */
const User = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('users');
  const [tableState, setTableState] = useTableState('users');
  const [usersTableState, setUsersTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { userReducer: { users, currentUser, cursor, filteredUsers }, roleReducer: { roles } } = useAppSelector((state) => state);

  /**
  * DataGrid Columns definition
  */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'id',
      headerName: String(t('id'))
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: String(t('name'))
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'username',
      headerName: String(t('username'))
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'email',
      headerName: String(t('email'))
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'role',
      headerName: String(t('role')),
      valueGetter: (params: GridValueGetterParams) => params.row.roles[0].name
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: String(t('status')),
      renderCell: (params: GridRenderCellParams) => (
        params.row.status ? <CustomChip label={t('active')} skin='light' color='success' /> : <CustomChip label={t('inactive')} skin='light' color='error' />
      )
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'createdAt',
      headerName: String(t('created_at')),
      valueFormatter: ({ value }: GridValueFormatterParams<any>) => formatDate(value)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'updatedAt',
      headerName: String(t('updated_at')),
      valueFormatter: ({ value }: GridValueFormatterParams<any>) => formatDate(value)
    }
  ];

  /**
   * Datagrid default column visibility model
   */
  const defaultColumnVisibility: GridColumnVisibilityModel = usersTableState.visibility ?? {
    id: false,
    name: true,
    username: true,
    email: true,
    role: true,
    status: true,
    createdAt: false,
    updatedAt: false,
  };

  /**
  * Filter fields definition
  */
  const filtersFields: ITableFilter[] = [
    {
      field: 'name',
      text: String(t('name')),
      type: 'string'
    },
    {
      field: 'username',
      text: String(t('username')),
      type: 'string'
    },
    {
      field: 'email',
      text: String(t('email')),
      type: 'string'
    },
    {
      field: 'roles',
      text: String(t('role')),
      type: 'select',
      options: roles.map((role) => ({
        value: role.id,
        text: role.name
      }))
    },
    {
      field: 'status',
      text: String(t('status')),
      type: 'boolean',
      options: [
        {
          value: 1,
          text: t('active')
        },
        {
          value: 2,
          text: t('inactive')
        }
      ]
    },
    {
      field: 'created_at',
      text: String(t('created_at')),
      type: 'date'
    },
    {
      field: 'updated_at',
      text: String(t('updated_at')),
      type: 'date'
    }
  ];

  // ** DataGrid Vars
  const [pageSize, setPageSize] = useState<number>(requestParams.pageSize ?? 100);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(usersTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(usersTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(usersTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!users.length || filters || sortModel) {
      getUsers();
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setUsersTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('users', usersTableState);
  }, [usersTableState]);

  /**
   * Get a list of users filtered, sorted and paginated
   */
  const getUsers = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType = generateSortQueryParams(sortModel);
    try {
      const userResponse: IResponseCursorPagination<IUser> = await dispatch(getUsersAction({cursor: cursor, pageSize: pageSize, filters: appliedFilters, sorts: appliedSortings})).then(unwrapResult);

      dispatch(setCursor(userResponse.next_cursor));
    } catch (error) {
      console.error('LIST ERROR:', error);
      displayErrors(error);
    }
    setTableLoading(false);
  };

  /**
   * DataGrid Table handlers
   */

  /**
   * Filter form submit handler
   * @param filters filters fields and values
   */
  const handleFilterSubmit = (filters: ITableFilterApplied[]) => {
    console.log(filters);
    setFilters(filters);
  };

  /**
   * DataGrid sorting colums change handler
   * @param sortModel sorted columns
   */
  const handleSortModelChange = (sortModel: GridSortModel) => {
    console.log(sortModel);
    setSortModel(sortModel);
  };

  /**
   * DataGrid row clicked handler
   * @param row Row clicked information
   */
  const handleRowClick = (row: GridRowParams) => {
    dispatch(setCurrentUser(row.row));
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor != null) {
      getUsers();
    }
  }

  /**
   * ColumnVisibilityModelChange handler
   */
  const handleColumnVisibilityModelChange = (model: GridColumnVisibilityModel) => {
    setVisibilityModel(model);
  }

  /**
   * ColumnOrderChange handler
   */
  const handleColumnOrderChange = (params: GridColumnOrderChangeParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    let changedColumns: GridColDef[] = [...columns];
    let movedColumn: GridColDef[] = changedColumns.splice(params.oldIndex, 1);
    changedColumns.splice(params.targetIndex, 0, movedColumn[0]);
    // dispatch(setUserColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Detail dialog close handler
   */
  const handleDetailDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentUser(undefined));
  };

  /**
   * Users section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddSubmit = async (formFields: IAddUser) => {
    setAddLoading(true);
    try {
      await dispatch(addUserAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      toast.success(t('add_usered_successfully'));
    } catch (error) {
      console.log('ADD USER ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  }

  /**
   * Form submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateUser) => {
    setEditLoading(true);
    try {
      await dispatch(updateUserAction(formFields)).then(unwrapResult);
      setOpenEditDialog(false);
      toast.success(t('user_modified_successfully'));
    } catch (error) {
      console.log('EDIT USER ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  }

  /**
   * User delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentUser) {
      try {
        await dispatch(deleteUserAction()).then(unwrapResult);
        handleDetailDialogClose();
        toast.success(t('user_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_user_selected'));
    }
    setDeleteLoading(false);
  };

  /**
   * Export handler
   */
  const handleExport = (exportData: ITableExport) => {
    setExportLoading(true);
    console.log(exportData);
    setExportData(exportData);
    setExportLoading(false);
  };

  return (
    <Grid container spacing={6}>
      <TableFilter filters={filtersFields} defaultFiltersApplied={filters} onSubmit={handleFilterSubmit} />
      <Grid item xs={12}>
        <Card>
          <TableHeader
            onAddClick={() => setOpenAddDialog(true)}
            onExportClick={() => setOpenTableExportDialog(true)}
            onColumnsClick={() => setOpenTableColumnVisibilityDialog(true)}
            canAdd={ability.can('create', 'user')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredUsers ?? users} 
              localeText={setDataGridLocale()}
              loading={tableLoading}
              onRowClick={handleRowClick}
              columnVisibilityModel={visibilityModel}
              onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
              onRowsScrollEnd={handleRowsScrollEnd}
              onColumnOrderChange={handleColumnOrderChange}
              onSortModelChange={handleSortModelChange}
              initialState={{
                sorting: {
                  sortModel: sortModel,
                },
              }}
              disableColumnMenu={true}
              hideFooterSelectedRowCount
              disableRowSelectionOnClick
            />
          </Box>
        </Card>
      </Grid>

      {openAddDialog &&
        <UserAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openDetailDialog &&
        <UserDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openEditDialog &&
        <UserEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openDeleteDialog &&
        <DeleteDialog
          open={openDeleteDialog}
          loading={deleteLoading}
          onConfirm={handleDeleteSubmit}
          onClose={() => setOpenDeleteDialog(false)}
        />
      }
      {openTableExportDialog &&
        <TableExportDialog
          open={openTableExportDialog}
          loading={exportLoading}
          columns={exportColumns}
          defaultExportData={exportData}
          onSubmit={handleExport}
          onClose={() => setOpenTableExportDialog(false)}
        />
      }
      {openTableColumnVisibilityDialog &&
        <TableColumnVisibilityDialog
          open={openTableColumnVisibilityDialog}
          columns={columns}
          columnVisibility={visibilityModel}
          onSubmit={handleColumnVisibilityModelChange}
          onClose={() => setOpenTableColumnVisibilityDialog(false)}
        />
      }
    </Grid>
  )
};

User.acl = {
  action: 'view',
  subject: 'user'
} as ACLObj;

export default Page(User);