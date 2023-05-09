// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useTranslation } from "react-i18next";

// ** Actions and Reducers Imports
import { addUserAction, deleteUserAction, getUsersAction, updateUserAction } from 'src/redux/actions/user';
import { setCurrentUser, setCursor } from 'src/redux/reducers/user';
import { setUserVisibility, setUserFilters, setUserSorts, setUserExport } from 'src/redux/reducers/table';

// ** Interfaces and Types Imports
import { IUser } from 'src/interfaces/user/user';
import { ITableFilter } from 'src/interfaces/tableFilter';
import { ITableExportColumn } from 'src/interfaces/tableExportColumn';

// ** MUI Imports
import { GridColDef, GridSortModel, GridRenderCellParams, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro, esES,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridColumnOrderChangeParams, GridValueFormatterParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';
import CustomChip from 'src/components/mui/chip';

// ** Third Party Imports
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
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddUser } from "src/interfaces/user/add";
import { IUpdateUser } from 'src/interfaces/user/update';

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'name',
    text: 'Nombre'
  },
  {
    field: 'username',
    text: 'Usuario'
  },
  {
    field: 'email',
    text: 'E-mail'
  },
  {
    field: 'roles',
    text: 'Rol'
  },
  {
    field: 'status',
    text: 'Estado'
  },
  {
    field: 'created_at',
    text: 'Fecha de creación'
  },
  {
    field: 'updated_at',
    text: 'Fecha de modificación'
  }
];

/**
 * User section index page
 * @returns User page component
 */
const User = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const { t } = useTranslation();
  const requestParams = useRequestParam('users');

  // ** Reducers
  const { userReducer: { users, currentUser, cursor, filteredUsers }, tableReducer: { users: usersDefinition } } = useAppSelector((state) => state);

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
  * Filter fields definition
  */
  const filters: ITableFilter[] = [
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
      type: 'string'
    },
    {
      field: 'status',
      text: String(t('status')),
      type: 'boolean'
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
  const [pageSize, setPageSize] = useState<number>(requestParams.pageSize ?? 20);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [tableColumns, setTableColumns] = useState<GridColDef[]>(columns);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!users.length || usersDefinition.filters) {
      getUsers();
    }
  }, [usersDefinition.filters, usersDefinition.sorts]);

  /**
   * Get a list of users filtered, sorted and paginated
   */
  const getUsers = async () => {
    setTableLoading(true);
    try {
      const userResponse: IResponseCursorPagination<IUser> = await dispatch(getUsersAction({cursor: cursor, pageSize: pageSize, filters: usersDefinition.filters, sorts: usersDefinition.sorts})).then(unwrapResult);

      dispatch(setCursor(userResponse.next_cursor));
    } catch (error) {
      console.log('LIST ERROR:', error);
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
  const handleFilterSubmit = (filters: FiltersFormValues) => {
    dispatch(setUserFilters(generateFilterQueryParams(filters)));
  };

  /**
   * DataGrid sorting colums change handler
   * @param sortModel sorted columns
   */
  const handleSortModelChange = (sortModel: GridSortModel) => {
    dispatch(setUserSorts(generateSortQueryParams(sortModel)));
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
      toast.success(t('user_successfully_added'));
    } catch (error) {
      console.log('ADD USER ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
    setOpenAddDialog(false);
  }

  /**
   * Form submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateUser) => {
    setEditLoading(true);
    try {
      await dispatch(updateUserAction(formFields)).then(unwrapResult);
      toast.success(t('user_successfully_modified'));
    } catch (error) {
      console.log('EDIT USER ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
    setOpenEditDialog(false);
  }

  /**
   * User delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentUser) {
      try {
        await dispatch(deleteUserAction()).then(unwrapResult);
        toast.success(t('user_successfully_deleted'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('unselected_user'));
    }
    handleDetailDialogClose();
    setDeleteLoading(false);
    setOpenDeleteDialog(false);
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
    dispatch(setUserVisibility(model));
  }

  const handleOnColumnOrderChange = (params: GridColumnOrderChangeParams) => {
    const oldIndex = params.oldIndex;
    const targetIndex = params.targetIndex;

    const movedColumn = tableColumns[oldIndex];
    const replacedColumn = tableColumns[targetIndex];

    tableColumns[targetIndex] = movedColumn;
    tableColumns[oldIndex] = replacedColumn;
  }

  return (
    <Grid container spacing={6}>
      <TableFilter filters={filters} onSubmit={handleFilterSubmit} />
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
              columns={tableColumns} 
              rows={filteredUsers ?? users} 
              localeText={setDataGridLocale()}
              loading={tableLoading}
              onRowClick={handleRowClick}
              columnVisibilityModel={usersDefinition.visibility}
              onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
              onRowsScrollEnd={handleRowsScrollEnd}
              onColumnOrderChange={handleOnColumnOrderChange}
              hideFooterRowCount
              hideFooterSelectedRowCount
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
          section={'users'}
          columns={exportColumns}
          onClose={() => setOpenTableExportDialog(false)}
        />
      }
      {openTableColumnVisibilityDialog &&
        <TableColumnVisibilityDialog
          open={openTableColumnVisibilityDialog}
          columns={columns}
          columnVisibility={usersDefinition.visibility}
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