// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addPurchaseAction, addPurchasePaymentAction, deletePurchaseAction, deletePurchasePaymentAction, getPurchasesAction, updatePurchaseAction, updatePurchasePaymentAction } from 'src/redux/actions/purchase';
import { setCurrentPurchase, setFilteredCursor, resetFilteredPurchases, setCurrentPurchaseProduct, setCurrentPurchasePayment } from 'src/redux/reducers/purchase';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddUpdatePurchase } from "src/interfaces/purchase/addUpdate";
import { IPurchase } from 'src/interfaces/purchase/purchase';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableState } from "src/interfaces/tableState";
import { MPurchaseProduct } from "src/models/purchase/product";
import { MPurchasePayment } from "src/models/purchase/payment";
import { IAddUpdatePurchasePayment } from "src/interfaces/purchase/addUpdatePayment";

// ** MUI Imports
import { GridColDef, GridSortModel, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridValueFormatterParams, GridColumnOrderChangeParams, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, generateFilterQueryParams, generateSortQueryParams, setDataGridLocale } from 'src/utils/common';
import { formatDate, formatMoney, formatNumber } from 'src/utils/format';
import useRequestParam from "src/hooks/useRequestParams";

// ** Custom components Imports
import TableHeader from 'src/components/table/TableHeader';
import TableFilter from 'src/components/table/TableFilter';
import PurchaseAddEditDialog from './components/AddEditDialog';
import PurchaseDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import PurchasePaymentAddEditDialog from "./components/PaymentAddEditDialog";
import { getProductDetailsAction } from "src/redux/actions/product";

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'purchased_at',
    text: 'date'
  },
  {
    field: 'identification_document',
    text: 'identification_document'
  },
  {
    field: 'name',
    text: 'name'
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
    field: 'business',
    text: 'business'
  },
  {
    field: 'establishment',
    text: 'establishment'
  },
  {
    field: 'warehouse',
    text: 'warehouse'
  },
  {
    field: 'payment_term',
    text: 'payment_term'
  },
  {
    field: 'document_type',
    text: 'document_type'
  },
  {
    field: 'expires_at',
    text: 'expires_at'
  },
  {
    field: 'paid_at',
    text: 'paid_at'
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
 * Purchase section index page
 * @returns Purchase page component
 */
const Purchase = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('purchases');
  const [tableState, setTableState] = useTableState('purchases');
  const [purchasesTableState, setPurchasesTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { purchaseReducer: { purchases, currentPurchase, currentPurchaseProduct, currentPurchasePayment, cursor, filteredCursor, filteredPurchases }, userReducer: { users }, documentTypeReducer: { documentTypes }, paymentTermReducer: { paymentTerms }, warehouseReducer: { warehouses }, businessReducer: { businesses }, establishmentReducer: { establishments } } = useAppSelector((state) => state);

  // ** Vars

  /**
  * DataGrid Columns definition
  */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'purchasedAt',
      headerName: String(t('date')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
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
      field: 'name',
      headerName: String(t('name'))
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'phone',
      headerName: String(t('phone'))
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
      minWidth: 200,
      field: 'business',
      headerName: String(t('business')),
      valueGetter: ({ row }: GridValueGetterParams) => row.establishment.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'establishment',
      headerName: String(t('establishment')),
      valueGetter: ({ row }: GridValueGetterParams) => row.establishment.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'warehouse',
      headerName: String(t('warehouse')),
      valueGetter: ({ row }: GridValueGetterParams) => row.warehouse.name
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'paymentTerm',
      headerName: String(t('payment_term')),
      valueGetter: ({ row }: GridValueGetterParams) => row.paymentTerm.name
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'documentType',
      headerName: String(t('document_type')),
      valueGetter: ({ row }: GridValueGetterParams) => row.documentType.name
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'expiresAt',
      headerName: String(t('expires_at')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'paidAt',
      headerName: String(t('paid_at')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'amount',
      headerName: String(t('amount')),
      valueGetter: ({ row }: GridValueGetterParams) => formatMoney(row.amount, row.currency)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'comments',
      headerName: String(t('comments'))
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
  const defaultColumnVisibility: GridColumnVisibilityModel = purchasesTableState.visibility ?? {
    purchasedAt: true,
    identificationDocument: true,
    name: true,
    phone: false,
    email: false,
    address: false,
    business: false,
    establishment: true,
    warehouse: false,
    paymentTerm: true,
    documentType: false,
    expiresAt: false,
    paidAt: false,
    amount: true,
    comments: false,
    createdAt: false,
    updatedAt: false
  };

  /**
  * Filter fields definition
  */
  const filtersFields: ITableFilter[] = [
    {
      field: 'purchased_at',
      text: String(t('date')),
      type: 'date'
    },
    {
      field: 'identification_document',
      text: String(t('identification_document')),
      type: 'string'
    },
    {
      field: 'name',
      text: String(t('name')),
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
      text: String(t('address')),
      type: 'string'
    },
    {
      field: 'business',
      text: String(t('business')),
      type: 'select',
      options: businesses.map((business) => ({
        value: business.id,
        text: business.name
      }))
    },
    {
      field: 'establishment',
      text: String(t('establishment')),
      type: 'select',
      options: establishments.map((establishment) => ({
        value: establishment.id,
        text: establishment.name
      }))
    },
    {
      field: 'warehouse',
      text: String(t('warehouse')),
      type: 'select',
      options: warehouses.map((warehouse) => ({
        value: warehouse.id,
        text: warehouse.name
      }))
    },
    {
      field: 'payment_term',
      text: String(t('payment_term')),
      type: 'select',
      options: paymentTerms.map((paymentTerm) => ({
        value: paymentTerm.id,
        text: paymentTerm.name
      }))
    },
    {
      field: 'document_type',
      text: String(t('document_type')),
      type: 'select',
      options: documentTypes.map((documentType) => ({
        value: documentType.id,
        text: documentType.name
      }))
    },
    {
      field: 'expires_at',
      text: String(t('expires_at')),
      type: 'date'
    },
    {
      field: 'paid_at',
      text: String(t('paid_at')),
      type: 'date'
    },
    {
      field: 'amount',
      text: String(t('amount')),
      type: 'numeric'
    },
    {
      field: 'seller',
      text: String(t('seller')),
      type: 'string',
      options: users.map((user) => ({
        value: user.id,
        text: user.name
      }))
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
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(purchasesTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(purchasesTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(purchasesTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState<boolean>(false);
  const [openPaymentAddEditDialog, setOpenPaymentAddEditDialog] = useState<boolean>(false);
  const [openPaymentDeleteDialog, setOpenPaymentDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addEditLoading, setAddEditLoading] = useState<boolean>(false);
  const [paymentAddEditLoading, setPaymentAddEditLoading] = useState<boolean>(false);
  const [paymentDeleteLoading, setPaymentDeleteLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    getProductDetails();
  }, []);

  useEffect(() => {
    if (!purchases.length || (filters && filters.length > 0) || (sortModel && sortModel.length > 0)) {
      getPurchases();
    } else {
      dispatch(setFilteredCursor(null));
      dispatch(resetFilteredPurchases());
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setPurchasesTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('purchases', purchasesTableState);
  }, [purchasesTableState]);

  /**
   * Get a list of purchases filtered, sorted and paginated
   */
  const getPurchases = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType | null = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType | null = generateSortQueryParams(sortModel) ?? generateSortQueryParams([{field: 'created_at', sort: 'desc'}]);
    try {
      const purchaseResponse: IResponseCursorPagination<IPurchase> = await dispatch(getPurchasesAction({
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
   * Get the list of all products
   */
  const getProductDetails = async () => {
    await dispatch(getProductDetailsAction({}));
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
    dispatch(setCurrentPurchase(row.row));
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor || filteredCursor) {
      getPurchases();
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
    // dispatch(setPurchaseColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Details dialog close handler
   */
  const handleDetailsDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentPurchase(undefined));
    dispatch(setCurrentPurchaseProduct(undefined));
    dispatch(setCurrentPurchasePayment(undefined));
  };

  /**
   * Purchase payment edit button click handler
   * @param purchasePayment selected payment to edit
   */
  const handlePaymentEditClick = (purchasePayment: MPurchasePayment) => {
    setOpenPaymentAddEditDialog(true);
    dispatch(setCurrentPurchasePayment(purchasePayment));
  };

  /**
   * Purchase payment add edit dialog close handler
   */
  const handlePaymentAddEditDialogClose = () => {
    setOpenPaymentAddEditDialog(false);
    dispatch(setCurrentPurchasePayment(undefined));
  };

  /**
   * Purchase payment delete button click handler
   * @param purchasePayment selected payment to edit
   */
  const handlePaymentDeleteClick = (purchasePayment: MPurchasePayment) => {
    setOpenPaymentDeleteDialog(true);
    dispatch(setCurrentPurchasePayment(purchasePayment));
  };

  /**
   * Payment delete dialog close handler
   */
  const handlePaymentDeleteDialogClose = () => {
    setOpenPaymentDeleteDialog(false);
    dispatch(setCurrentPurchasePayment(undefined));
  };

  /**
   * Purchases section handlers
   */

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddEditSubmit = async (formFields: IAddUpdatePurchase) => {
    setAddEditLoading(true);
    console.log(formFields)
    try {
      if (currentPurchase) {
        await dispatch(updatePurchaseAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        toast.success(t('purchase_modified_successfully'));
      } else {
        await dispatch(addPurchaseAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        setOpenDetailDialog(true);
        toast.success(t('purchase_added_successfully'));
      }
    } catch (error) {
      console.error('ADD PURCHASE ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * Purchase payment add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handlePaymentAddEditSubmit = async (formFields: IAddUpdatePurchasePayment) => {
    setPaymentAddEditLoading(true);
    try {
      if (currentPurchasePayment) {
        await dispatch(updatePurchasePaymentAction(formFields)).then(unwrapResult);
        handlePaymentAddEditDialogClose();
        toast.success(t('payment_modified_successfully'));
      } else {
        await dispatch(addPurchasePaymentAction(formFields)).then(unwrapResult);
        handlePaymentAddEditDialogClose();
        toast.success(t('payment_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/UPDATE PURCHASE PAYMENT ERROR: ', error);
      displayErrors(error);
    }
    setPaymentAddEditLoading(false);
  };

  /**
   * Purchase payment delete event submit handler
   */
  const handlePaymentDeleteSubmit = async () => {
    setPaymentDeleteLoading(true);
    if (currentPurchasePayment) {
      try {
        await dispatch(deletePurchasePaymentAction()).then(unwrapResult);
        setOpenPaymentDeleteDialog(false);
        dispatch(setCurrentPurchasePayment(undefined));
        toast.success(t('payment_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_payment_selected'));
    }
    setPaymentDeleteLoading(false);
  };

  /**
   * Purchase delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentPurchase) {
      try {
        await dispatch(deletePurchaseAction()).then(unwrapResult);
        handleDetailsDialogClose();
        setOpenDeleteDialog(false);
        toast.success(t('purchase_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_purchase_selected'));
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
            onAddClick={() => setOpenAddEditDialog(true)}
            onExportClick={() => setOpenTableExportDialog(true)}
            onColumnsClick={() => setOpenTableColumnVisibilityDialog(true)}
            canAdd={ability.can('create', 'purchase')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredPurchases ?? purchases} 
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
        <PurchaseDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenAddEditDialog(true)}
          onPaymentAddClick={() => setOpenPaymentAddEditDialog(true)}
          onPaymentEditClick={handlePaymentEditClick}
          onPaymentDeleteClick={handlePaymentDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailsDialogClose}
        />
      }
      {openAddEditDialog &&
        <PurchaseAddEditDialog
          open={openAddEditDialog}
          loading={addEditLoading}
          onSubmit={handleAddEditSubmit}
          onClose={() => setOpenAddEditDialog(false)}
        />
      }
      {openPaymentAddEditDialog &&
        <PurchasePaymentAddEditDialog
          open={openPaymentAddEditDialog}
          loading={paymentAddEditLoading}
          onSubmit={handlePaymentAddEditSubmit}
          onClose={handlePaymentAddEditDialogClose}
        />
      }
      {openPaymentDeleteDialog &&
        <DeleteDialog
          open={openPaymentDeleteDialog} 
          loading={paymentDeleteLoading}
          onConfirm={handlePaymentDeleteSubmit}
          onClose={handlePaymentDeleteDialogClose}
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

Purchase.acl = {
  action: 'view',
  subject: 'purchase'
} as ACLObj;

export default Page(Purchase);