// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addSupplierAction, addSupplierAddressAction, addSupplierContactAction, deleteSupplierAction, deleteSupplierAddressAction, deleteSupplierContactAction, getSuppliersAction, updateSupplierAction, updateSupplierAddressAction, updateSupplierContactAction } from 'src/redux/actions/supplier';
import { setCurrentSupplier, setCursor, setCurrentSupplierAddress, setCurrentSupplierContact, setFilteredCursor, resetFilteredSuppliers } from 'src/redux/reducers/supplier';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddSupplier } from "src/interfaces/supplier/add";
import { IUpdateSupplier } from 'src/interfaces/supplier/update';
import { ISupplier } from 'src/interfaces/supplier/supplier';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableState } from "src/interfaces/tableState";
import { MSupplierContact } from "src/models/supplier/contact";
import { MSupplierAddress } from "src/models/supplier/address";
import { IAddUpdateSupplierContact } from "src/interfaces/supplier/addUpdateContact";
import { IAddUpdateSupplierAddress } from "src/interfaces/supplier/addUpdateAddress";

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
import SupplierAddDialog from './components/AddDialog';
import SupplierEditDialog from './components/EditDialog';
import SupplierDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import SupplierContactAddEditDialog from "./components/ContactAddEditDialog";
import SupplierAddressAddEditDialog from "./components/AddressAddEditDialog";

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
    field: 'phone',
    text: 'phone'
  },
  {
    field: 'email',
    text: 'email'
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
 * Supplier section index page
 * @returns Supplier page component
 */
const Supplier = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('suppliers');
  const [tableState, setTableState] = useTableState('suppliers');
  const [suppliersTableState, setSuppliersTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { supplierReducer: { suppliers, currentSupplier, currentSupplierAddress, currentSupplierContact, cursor, filteredCursor, filteredSuppliers } } = useAppSelector((state) => state);

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
  const defaultColumnVisibility: GridColumnVisibilityModel = suppliersTableState.visibility ?? {
    name: true,
    identificationDocument: true,
    phone: true,
    email: true,
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
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(suppliersTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(suppliersTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(suppliersTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openContactAddEditDialog, setOpenContactAddEditDialog] = useState<boolean>(false);
  const [openContactDeleteDialog, setOpenContactDeleteDialog] = useState<boolean>(false);
  const [openAddressAddEditDialog, setOpenAddressAddEditDialog] = useState<boolean>(false);
  const [openAddressDeleteDialog, setOpenAddressDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [contactAddEditLoading, setContactAddEditLoading] = useState<boolean>(false);
  const [contactDeleteLoading, setContactDeleteLoading] = useState<boolean>(false);
  const [addressAddEditLoading, setAddressAddEditLoading] = useState<boolean>(false);
  const [addressDeleteLoading, setAddressDeleteLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!suppliers.length || (filters && filters.length > 0) || (sortModel && sortModel.length > 0)) {
      getSuppliers();
    } else {
      dispatch(setFilteredCursor(null));
      dispatch(resetFilteredSuppliers());
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setSuppliersTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('suppliers', suppliersTableState);
  }, [suppliersTableState]);

  /**
   * Get a list of suppliers filtered, sorted and paginated
   */
  const getSuppliers = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType | null = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType | null = generateSortQueryParams(sortModel) ?? generateSortQueryParams([{field: 'created_at', sort: 'desc'}]);
    try {
      const supplierResponse: IResponseCursorPagination<ISupplier> = await dispatch(getSuppliersAction({
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
    dispatch(setCurrentSupplier(row.row));
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor || filteredCursor) {
      getSuppliers();
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
    // dispatch(setSupplierColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Details dialog close handler
   */
  const handleDetailsDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentSupplier(undefined));
    dispatch(setCurrentSupplierContact(undefined));
    dispatch(setCurrentSupplierAddress(undefined));
  };

  /**
   * Supplier contact edit button click handler
   * @param supplierContact selected contact to edit
   */
  const handleContactEditClick = (supplierContact: MSupplierContact) => {
    setOpenContactAddEditDialog(true);
    dispatch(setCurrentSupplierContact(supplierContact));
  };

  /**
   * Supplier contact add edit dialog close handler
   */
  const handleContactAddEditDialogClose = () => {
    setOpenContactAddEditDialog(false);
    dispatch(setCurrentSupplierContact(undefined));
  };

  /**
   * Supplier contact delete button click handler
   * @param supplierContact selected contact to edit
   */
  const handleContactDeleteClick = (supplierContact: MSupplierContact) => {
    setOpenContactDeleteDialog(true);
    dispatch(setCurrentSupplierContact(supplierContact));
  };

  /**
   * Contact delete dialog close handler
   */
  const handleContactDeleteDialogClose = () => {
    setOpenContactDeleteDialog(false);
    dispatch(setCurrentSupplierContact(undefined));
  };

  /**
   * Supplier address edit button click handler
   * @param supplierAddress selected address to edit
   */
  const handleAddressEditClick = (supplierAddress: MSupplierAddress) => {
    setOpenAddressAddEditDialog(true);
    dispatch(setCurrentSupplierAddress(supplierAddress));
  };

  /**
   * Supplier address add edit dialog close handler
   */
  const handleAddressAddEditDialogClose = () => {
    setOpenAddressAddEditDialog(false);
    dispatch(setCurrentSupplierAddress(undefined));
  };

  /**
   * Supplier address delete button click handler
   * @param supplierAddress selected address to edit
   */
  const handleAddressDeleteClick = (supplierAddress: MSupplierAddress) => {
    setOpenAddressDeleteDialog(true);
    dispatch(setCurrentSupplierAddress(supplierAddress));
  };

  /**
   * Address delete dialog close handler
   */
  const handleAddressDeleteDialogClose = () => {
    setOpenAddressDeleteDialog(false);
    dispatch(setCurrentSupplierAddress(undefined));
  };

  /**
   * Suppliers section handlers
   */

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddSubmit = async (formFields: IAddSupplier) => {
    setAddLoading(true);
    console.log(formFields)
    try {
      await dispatch(addSupplierAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      setOpenDetailDialog(true);
      toast.success(t('supplier_added_succesfully'));
    } catch (error) {
      console.error('ADD SUPPLIER ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  }

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateSupplier) => {
    setEditLoading(true);
    try {
      await dispatch(updateSupplierAction(formFields)).then(unwrapResult);
      setOpenEditDialog(false);
      toast.success(t('supplier_modified_successfully'));
    } catch (error) {
      console.error('EDIT SUPPLIER ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  }

  /**
   * Supplier contact add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleContactAddEditSubmit = async (formFields: IAddUpdateSupplierContact) => {
    setContactAddEditLoading(true);
    try {
      if (currentSupplierContact) {
        await dispatch(updateSupplierContactAction(formFields)).then(unwrapResult);
        handleContactAddEditDialogClose();
        toast.success(t('contact_modified_successfully'));
      } else {
        await dispatch(addSupplierContactAction(formFields)).then(unwrapResult);
        handleContactAddEditDialogClose();
        toast.success(t('contact_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE SUPPLIER CONTACT ERROR: ', error);
      displayErrors(error);
    }
    setContactAddEditLoading(false);
  };

  /**
   * Supplier contact delete event submit handler
   */
  const handleContactDeleteSubmit = async () => {
    setContactDeleteLoading(true);
    if (currentSupplierContact) {
      try {
        await dispatch(deleteSupplierContactAction()).then(unwrapResult);
        setOpenContactDeleteDialog(false);
        dispatch(setCurrentSupplierContact(undefined));
        toast.success(t('contact_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_contact_selected'));
    }
    setContactDeleteLoading(false);
  };

  /**
   * Supplier address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddressAddEditSubmit = async (formFields: IAddUpdateSupplierAddress) => {
    setAddressAddEditLoading(true);
    try {
      if (currentSupplierAddress) {
        await dispatch(updateSupplierAddressAction(formFields)).then(unwrapResult);
        handleAddressAddEditDialogClose();
        toast.success(t('address_modified_successfully'));
      } else {
        await dispatch(addSupplierAddressAction(formFields)).then(unwrapResult);
        handleAddressAddEditDialogClose();
        toast.success(t('address_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE SUPPLIER ADDRESS ERROR: ', error);
      displayErrors(error);
    }
    setAddressAddEditLoading(false);
  };

  /**
   * Supplier address delete event submit handler
   */
  const handleAddressDeleteSubmit = async () => {
    setAddressDeleteLoading(true);
    if (currentSupplierAddress) {
      try {
        await dispatch(deleteSupplierAddressAction()).then(unwrapResult);
        setOpenAddressDeleteDialog(false);
        dispatch(setCurrentSupplierAddress(undefined));
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
   * Supplier delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentSupplier) {
      try {
        await dispatch(deleteSupplierAction()).then(unwrapResult);
        handleDetailsDialogClose();
        setOpenDeleteDialog(false);
        toast.success(t('supplier_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_supplier_selected'));
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
            canAdd={ability.can('create', 'supplier')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredSuppliers ?? suppliers} 
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
        <SupplierDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onContactAddClick={() => setOpenContactAddEditDialog(true)}
          onContactEditClick={handleContactEditClick}
          onContactDeleteClick={handleContactDeleteClick}
          onAddressAddClick={() => setOpenAddressAddEditDialog(true)}
          onAddressEditClick={handleAddressEditClick}
          onAddressDeleteClick={handleAddressDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailsDialogClose}
        />
      }
      {openAddDialog &&
        <SupplierAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <SupplierEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openContactAddEditDialog &&
        <SupplierContactAddEditDialog
          open={openContactAddEditDialog}
          loading={contactAddEditLoading}
          onSubmit={handleContactAddEditSubmit}
          onClose={handleContactAddEditDialogClose}
        />
      }
      {openContactDeleteDialog &&
        <DeleteDialog
          open={openContactDeleteDialog} 
          loading={contactDeleteLoading}
          onConfirm={handleContactDeleteSubmit}
          onClose={handleContactDeleteDialogClose}
        />
      }
      {openAddressAddEditDialog &&
        <SupplierAddressAddEditDialog
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

Supplier.acl = {
  action: 'view',
  subject: 'supplier'
} as ACLObj;

export default Page(Supplier);