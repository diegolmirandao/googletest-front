// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addCustomerAction, addCustomerAddressAction, addCustomerBillingAddressAction, addCustomerReferenceAction, deleteCustomerAction, deleteCustomerAddressAction, deleteCustomerBillingAddressAction, deleteCustomerReferenceAction, getCustomersAction, updateCustomerAction, updateCustomerAddressAction, updateCustomerBillingAddressAction, updateCustomerReferenceAction } from 'src/redux/actions/customer';
import { setCurrentCustomer, setCursor, setCurrentCustomerAddress, setCurrentCustomerBillingAddress, setCurrentCustomerReference, setFilteredCursor, resetFilteredCustomers } from 'src/redux/reducers/customer';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddCustomer } from "src/interfaces/customer/add";
import { IUpdateCustomer } from 'src/interfaces/customer/update';
import { ICustomer } from 'src/interfaces/customer/customer';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableState } from "src/interfaces/tableState";
import { MCustomerBillingAddress } from "src/models/customer/billingAddress";
import { MCustomerReference } from "src/models/customer/reference";
import { MCustomerAddress } from "src/models/customer/address";
import { IAddUpdateCustomerBillingAddress } from "src/interfaces/customer/addUpdateBillingAddress";
import { IAddUpdateCustomerReference } from "src/interfaces/customer/addUpdateReference";
import { IAddUpdateCustomerAddress } from "src/interfaces/customer/addUpdateAddress";

// ** MUI Imports
import { GridColDef, GridSortModel, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridValueFormatterParams, GridColumnOrderChangeParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, generateFilterQueryParams, generateSortQueryParams, setDataGridLocale } from 'src/utils/common';
import { formatDate } from 'src/utils/format';
import useRequestParam from "src/hooks/useRequestParams";

// ** Custom components Imports
import TableHeader from 'src/components/table/TableHeader';
import TableFilter from 'src/components/table/TableFilter';
import CustomerAddDialog from './components/AddDialog';
import CustomerEditDialog from './components/EditDialog';
import CustomerDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import CustomerBillingAddressAddEditDialog from "./components/BillingAddressAddEditDialog";
import CustomerReferenceAddEditDialog from "./components/ReferenceAddEditDialog";
import CustomerAddressAddEditDialog from "./components/AddressAddEditDialog";

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'name',
    text: 'name'
  },
  {
    field: 'identificationDocument',
    text: 'identification_document'
  },
  {
    field: 'category',
    text: 'category'
  },
  {
    field: 'acquisitionChannel',
    text: 'acquisition_channel'
  },
  {
    field: 'phone',
    text: 'phone'
  },
  {
    field: 'email',
    text: 'email'
  },
  {
    field: 'birthday',
    text: 'birthday'
  },
  {
    field: 'address',
    text: 'address'
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
 * Customer section index page
 * @returns Customer page component
 */
const Customer = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('customers');
  const [tableState, setTableState] = useTableState('customers');
  const [customersTableState, setCustomersTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { customerReducer: { customers, currentCustomer, currentCustomerAddress, currentCustomerBillingAddress, currentCustomerReference, cursor, filteredCursor, filteredCustomers }, customerCategoryReducer: { customerCategories }, acquisitionChannelReducer: { acquisitionChannels } } = useAppSelector((state) => state);

  /**
  * DataGrid Columns definition
  */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: String(t('name'))
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'identificationDocument',
      headerName: String(t('identification_document'))
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'category',
      headerName: String(t('category')),
      valueGetter: ({ row }: GridValueGetterParams) => row.category.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'acquisitionChannel',
      headerName: String(t('acquisition_channel')),
      valueGetter: ({ row }: GridValueGetterParams) => row.acquisitionChannel.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'phone',
      headerName: String(t('phone')),
      filterable: false,
      valueGetter: ({ row }: GridValueGetterParams) => row.phones[0]
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'email',
      headerName: String(t('email'))
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'birthday',
      headerName: String(t('birthday')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'address',
      headerName: String(t('address'))
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
  const defaultColumnVisibility: GridColumnVisibilityModel = customersTableState.visibility ?? {
    name: true,
    identificationDocument: true,
    category: false,
    acquisitionChannel: false,
    phone: true,
    email: true,
    birthday: false,
    address: false,
    createdAt: false,
    updatedAt: false
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
      field: 'identification_document',
      text: String(t('identification_document')),
      type: 'string'
    },
    {
      field: 'customer_category_id',
      text: String(t('category')),
      type: 'select',
      options: customerCategories.map((category) => ({
        value: category.id,
        text: category.name
      }))
    },
    {
      field: 'acquisition_channel_id',
      text: String(t('acquisition_channel')),
      type: 'select',
      options: acquisitionChannels.map((acquisitionChannel) => ({
        value: acquisitionChannel.id,
        text: acquisitionChannel.name
      }))
    },
    {
      field: 'phone',
      text: String(t('phone')),
      type: 'string'
    },
    {
      field: 'email',
      text: String(t('email')),
      type: 'string'
    },
    {
      field: 'birthday',
      text: String(t('birthday')),
      type: 'date'
    },
    {
      field: 'address',
      text: 'Dirección',
      type: 'string'
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
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(customersTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(customersTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(customersTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openBillingAddressAddEditDialog, setOpenBillingAddressAddEditDialog] = useState<boolean>(false);
  const [openBillingAddressDeleteDialog, setOpenBillingAddressDeleteDialog] = useState<boolean>(false);
  const [openReferenceAddEditDialog, setOpenReferenceAddEditDialog] = useState<boolean>(false);
  const [openReferenceDeleteDialog, setOpenReferenceDeleteDialog] = useState<boolean>(false);
  const [openAddressAddEditDialog, setOpenAddressAddEditDialog] = useState<boolean>(false);
  const [openAddressDeleteDialog, setOpenAddressDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [billingAddressAddEditLoading, setBillingAddressAddEditLoading] = useState<boolean>(false);
  const [billingAddressDeleteLoading, setBillingAddressDeleteLoading] = useState<boolean>(false);
  const [referenceAddEditLoading, setReferenceAddEditLoading] = useState<boolean>(false);
  const [referenceDeleteLoading, setReferenceDeleteLoading] = useState<boolean>(false);
  const [addressAddEditLoading, setAddressAddEditLoading] = useState<boolean>(false);
  const [addressDeleteLoading, setAddressDeleteLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!customers.length || (filters && filters.length > 0) || (sortModel && sortModel.length > 0)) {
      getCustomers();
    } else {
      dispatch(setFilteredCursor(null));
      dispatch(resetFilteredCustomers());
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setCustomersTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('customers', customersTableState);
  }, [customersTableState]);

  /**
   * Get a list of customers filtered, sorted and paginated
   */
  const getCustomers = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType | null = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType | null = generateSortQueryParams(sortModel) ?? generateSortQueryParams([{field: 'created_at', sort: 'desc'}]);
    try {
      const customerResponse: IResponseCursorPagination<ICustomer> = await dispatch(getCustomersAction({
        filters: appliedFilters,
        sorts: appliedSortings
      })).then(unwrapResult);
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
    console.log(row.row);
    dispatch(setCurrentCustomer(row.row));
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor || filteredCursor) {
      getCustomers();
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
    // dispatch(setCustomerColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Details dialog close handler
   */
  const handleDetailsDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentCustomer(undefined));
    dispatch(setCurrentCustomerBillingAddress(undefined));
    dispatch(setCurrentCustomerReference(undefined));
    dispatch(setCurrentCustomerAddress(undefined));
  };

  /**
   * Customer billingaddress edit button click handler
   * @param customerBillingAddress selected billingaddress to edit
   */
  const handleBillingAddressEditClick = (customerBillingAddress: MCustomerBillingAddress) => {
    setOpenBillingAddressAddEditDialog(true);
    dispatch(setCurrentCustomerBillingAddress(customerBillingAddress));
  };

  /**
   * Customer billingaddress add edit dialog close handler
   */
  const handleBillingAddressAddEditDialogClose = () => {
    setOpenBillingAddressAddEditDialog(false);
    dispatch(setCurrentCustomerBillingAddress(undefined));
  };

  /**
   * Customer billingaddress delete button click handler
   * @param customerBillingAddress selected billingaddress to edit
   */
  const handleBillingAddressDeleteClick = (customerBillingAddress: MCustomerBillingAddress) => {
    setOpenBillingAddressDeleteDialog(true);
    dispatch(setCurrentCustomerBillingAddress(customerBillingAddress));
  };

  /**
   * BillingAddress delete dialog close handler
   */
  const handleBillingAddressDeleteDialogClose = () => {
    setOpenBillingAddressDeleteDialog(false);
    dispatch(setCurrentCustomerBillingAddress(undefined));
  };

  /**
   * Customer reference edit button click handler
   * @param customerReference selected reference to edit
   */
  const handleReferenceEditClick = (customerReference: MCustomerReference) => {
    setOpenReferenceAddEditDialog(true);
    dispatch(setCurrentCustomerReference(customerReference));
  };

  /**
   * Customer reference add edit dialog close handler
   */
  const handleReferenceAddEditDialogClose = () => {
    setOpenReferenceAddEditDialog(false);
    dispatch(setCurrentCustomerReference(undefined));
  };

  /**
   * Customer reference delete button click handler
   * @param customerReference selected reference to edit
   */
  const handleReferenceDeleteClick = (customerReference: MCustomerReference) => {
    setOpenReferenceDeleteDialog(true);
    dispatch(setCurrentCustomerReference(customerReference));
  };

  /**
   * Reference delete dialog close handler
   */
  const handleReferenceDeleteDialogClose = () => {
    setOpenReferenceDeleteDialog(false);
    dispatch(setCurrentCustomerReference(undefined));
  };

  /**
   * Customer address edit button click handler
   * @param customerAddress selected address to edit
   */
  const handleAddressEditClick = (customerAddress: MCustomerAddress) => {
    setOpenAddressAddEditDialog(true);
    dispatch(setCurrentCustomerAddress(customerAddress));
  };

  /**
   * Customer address add edit dialog close handler
   */
  const handleAddressAddEditDialogClose = () => {
    setOpenAddressAddEditDialog(false);
    dispatch(setCurrentCustomerAddress(undefined));
  };

  /**
   * Customer address delete button click handler
   * @param customerAddress selected address to edit
   */
  const handleAddressDeleteClick = (customerAddress: MCustomerAddress) => {
    setOpenAddressDeleteDialog(true);
    dispatch(setCurrentCustomerAddress(customerAddress));
  };

  /**
   * Address delete dialog close handler
   */
  const handleAddressDeleteDialogClose = () => {
    setOpenAddressDeleteDialog(false);
    dispatch(setCurrentCustomerAddress(undefined));
  };

  /**
   * Customers section handlers
   */

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddSubmit = async (formFields: IAddCustomer) => {
    setAddLoading(true);
    console.log(formFields)
    try {
      await dispatch(addCustomerAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      setOpenDetailDialog(true);
      toast.success(t('customer_added_succesfully'));
    } catch (error) {
      console.error('ADD CUSTOMER ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  }

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateCustomer) => {
    setEditLoading(true);
    try {
      await dispatch(updateCustomerAction(formFields)).then(unwrapResult);
      setOpenEditDialog(false);
      toast.success(t('customer_modified_successfully'));
    } catch (error) {
      console.error('EDIT CUSTOMER ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  }

  /**
   * Customer billing address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleBillingAddressAddEditSubmit = async (formFields: IAddUpdateCustomerBillingAddress) => {
    setBillingAddressAddEditLoading(true);
    try {
      if (currentCustomerBillingAddress) {
        await dispatch(updateCustomerBillingAddressAction(formFields)).then(unwrapResult);
        handleBillingAddressAddEditDialogClose();
        toast.success(t('billing_address_modified_successfully'));
      } else {
        await dispatch(addCustomerBillingAddressAction(formFields)).then(unwrapResult);
        handleBillingAddressAddEditDialogClose();
        toast.success(t('billing_address_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE CUSTOMER BILLINGADDRESS ERROR: ', error);
      displayErrors(error);
    }
    setBillingAddressAddEditLoading(false);
  };

  /**
   * Customer billing address delete event submit handler
   */
  const handleBillingAddressDeleteSubmit = async () => {
    setBillingAddressDeleteLoading(true);
    if (currentCustomerBillingAddress) {
      try {
        await dispatch(deleteCustomerBillingAddressAction()).then(unwrapResult);
        setOpenBillingAddressDeleteDialog(false);
        dispatch(setCurrentCustomerBillingAddress(undefined));
        toast.success(t('billing_address_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_billing_address_selected'));
    }
    setBillingAddressDeleteLoading(false);
  };

  /**
   * Customer reference add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleReferenceAddEditSubmit = async (formFields: IAddUpdateCustomerReference) => {
    setReferenceAddEditLoading(true);
    try {
      if (currentCustomerReference) {
        await dispatch(updateCustomerReferenceAction(formFields)).then(unwrapResult);
        handleReferenceAddEditDialogClose();
        toast.success(t('reference_modified_successfully'));
      } else {
        await dispatch(addCustomerReferenceAction(formFields)).then(unwrapResult);
        handleReferenceAddEditDialogClose();
        toast.success(t('reference_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE CUSTOMER REFERENCE ERROR: ', error);
      displayErrors(error);
    }
    setReferenceAddEditLoading(false);
  };

  /**
   * Customer reference delete event submit handler
   */
  const handleReferenceDeleteSubmit = async () => {
    setReferenceDeleteLoading(true);
    if (currentCustomerReference) {
      try {
        await dispatch(deleteCustomerReferenceAction()).then(unwrapResult);
        setOpenReferenceDeleteDialog(false);
        dispatch(setCurrentCustomerReference(undefined));
        toast.success(t('reference_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_reference_selected'));
    }
    setReferenceDeleteLoading(false);
  };

  /**
   * Customer address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddressAddEditSubmit = async (formFields: IAddUpdateCustomerAddress) => {
    setAddressAddEditLoading(true);
    try {
      if (currentCustomerAddress) {
        await dispatch(updateCustomerAddressAction(formFields)).then(unwrapResult);
        handleAddressAddEditDialogClose();
        toast.success(t('address_modified_successfully'));
      } else {
        await dispatch(addCustomerAddressAction(formFields)).then(unwrapResult);
        handleAddressAddEditDialogClose();
        toast.success(t('address_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE CUSTOMER ADDRESS ERROR: ', error);
      displayErrors(error);
    }
    setAddressAddEditLoading(false);
  };

  /**
   * Customer address delete event submit handler
   */
  const handleAddressDeleteSubmit = async () => {
    setAddressDeleteLoading(true);
    if (currentCustomerAddress) {
      try {
        await dispatch(deleteCustomerAddressAction()).then(unwrapResult);
        setOpenAddressDeleteDialog(false);
        dispatch(setCurrentCustomerAddress(undefined));
        toast.success(t('address_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_address_selected'));
    }
    setAddressDeleteLoading(false);
  };
  
  /**
   * Customer delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentCustomer) {
      try {
        await dispatch(deleteCustomerAction()).then(unwrapResult);
        handleDetailsDialogClose();
        setOpenDeleteDialog(false);
        toast.success(t('customer_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_customer_selected'));
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
            canAdd={ability.can('create', 'customer')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredCustomers ?? customers} 
              localeText={setDataGridLocale()}
              loading={tableLoading}
              onRowClick={handleRowClick}
              columnVisibilityModel={visibilityModel}
              onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
              onRowsScrollEnd={handleRowsScrollEnd}
              onColumnOrderChange={handleColumnOrderChange}
              onSortModelChange={handleSortModelChange}
              sortModel={sortModel}
              disableColumnMenu={true}
              filterMode="server"
              sortingMode="server"
              hideFooterSelectedRowCount
              disableRowSelectionOnClick
            />
          </Box>
        </Card>
      </Grid>

      {openDetailDialog &&
        <CustomerDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onBillingAddressAddClick={() => setOpenBillingAddressAddEditDialog(true)}
          onBillingAddressEditClick={handleBillingAddressEditClick}
          onBillingAddressDeleteClick={handleBillingAddressDeleteClick}
          onReferenceAddClick={() => setOpenReferenceAddEditDialog(true)}
          onReferenceEditClick={handleReferenceEditClick}
          onReferenceDeleteClick={handleReferenceDeleteClick}
          onAddressAddClick={() => setOpenAddressAddEditDialog(true)}
          onAddressEditClick={handleAddressEditClick}
          onAddressDeleteClick={handleAddressDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailsDialogClose}
        />
      }
      {openAddDialog &&
        <CustomerAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <CustomerEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openBillingAddressAddEditDialog &&
        <CustomerBillingAddressAddEditDialog
          open={openBillingAddressAddEditDialog}
          loading={billingAddressAddEditLoading}
          onSubmit={handleBillingAddressAddEditSubmit}
          onClose={handleBillingAddressAddEditDialogClose}
        />
      }
      {openBillingAddressDeleteDialog &&
        <DeleteDialog
          open={openBillingAddressDeleteDialog} 
          loading={billingAddressDeleteLoading}
          onConfirm={handleBillingAddressDeleteSubmit}
          onClose={handleBillingAddressDeleteDialogClose}
        />
      }
      {openReferenceAddEditDialog &&
        <CustomerReferenceAddEditDialog
          open={openReferenceAddEditDialog}
          loading={referenceAddEditLoading}
          onSubmit={handleReferenceAddEditSubmit}
          onClose={handleReferenceAddEditDialogClose}
        />
      }
      {openReferenceDeleteDialog &&
        <DeleteDialog
          open={openReferenceDeleteDialog} 
          loading={referenceDeleteLoading}
          onConfirm={handleReferenceDeleteSubmit}
          onClose={handleReferenceDeleteDialogClose}
        />
      }
      {openAddressAddEditDialog &&
        <CustomerAddressAddEditDialog
          open={openAddressAddEditDialog}
          loading={addressAddEditLoading}
          onSubmit={handleAddressAddEditSubmit}
          onClose={handleAddressAddEditDialogClose}
        />
      }
      {openAddressDeleteDialog &&
        <DeleteDialog
          open={openAddressDeleteDialog} 
          loading={addressDeleteLoading}
          onConfirm={handleAddressDeleteSubmit}
          onClose={handleAddressDeleteDialogClose}
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

Customer.acl = {
  action: 'view',
  subject: 'customer'
} as ACLObj;

export default Page(Customer);