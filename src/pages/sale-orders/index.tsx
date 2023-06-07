// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addSaleOrderAction, addSaleOrderProductsAction, cancelSaleOrderAction, cancelSaleOrderProductAction, deleteSaleOrderAction, deleteSaleOrderProductAction, getSaleOrdersAction, updateSaleOrderAction, updateSaleOrderProductAction } from 'src/redux/actions/saleOrder';
import { setCurrentSaleOrder, setFilteredCursor, resetFilteredSaleOrders, setCurrentSaleOrderProduct } from 'src/redux/reducers/saleOrder';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddSaleOrder } from "src/interfaces/sale-order/add";
import { ISaleOrder } from 'src/interfaces/sale-order/saleOrder';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableState } from "src/interfaces/tableState";
import { MSaleOrderProduct } from "src/models/sale-order/product";
import { ICancelSaleOrderProduct } from "src/interfaces/sale-order/cancelProduct";
import { getProductDetailsAction } from "src/redux/actions/product";
import { IUpdateSaleOrderProduct } from "src/interfaces/sale-order/updateProduct";
import { IAddSaleOrderProduct } from "src/interfaces/sale-order/addProduct";

// ** MUI Imports
import { GridColDef, GridSortModel, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridValueFormatterParams, GridColumnOrderChangeParams, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, generateFilterQueryParams, generateSortQueryParams, setDataGridLocale } from 'src/utils/common';
import { formatDate, formatMoney } from 'src/utils/format';
import useRequestParam from "src/hooks/useRequestParams";

// ** Custom components Imports
import TableHeader from 'src/components/table/TableHeader';
import TableFilter from 'src/components/table/TableFilter';
import SaleOrderDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import SaleOrderProductEditDialog from "./components/ProductEditDialog";
import SaleOrderProductsAddDialog from "./components/ProductsAddDialog";
import SaleOrderProductsCancelDialog from "./components/ProductsCancelDialog";
import SaleOrderProductCancelDialog from "./components/ProductCancelDialog";
import Chip from "src/components/mui/chip";
import ConfirmDialog from "src/components/ConfirmDialog";
import SaleOrderEditDialog from "./components/EditDialog";
import SaleOrderAddDialog from "./components/AddDialog";
import { IUpdateSaleOrder } from "src/interfaces/sale-order/update";

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'ordered_at',
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
    field: 'point_of_sale',
    text: 'point_of_sale'
  },
  {
    field: 'warehouse',
    text: 'warehouse'
  },
  {
    field: 'status',
    text: 'status'
  },
  {
    field: 'expires_at',
    text: 'expires_at'
  },
  {
    field: 'billed_at',
    text: 'billed_at'
  },
  {
    field: 'seller',
    text: 'seller'
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

const StatusChip = (props: {statusId: number}) => {
  switch (props.statusId) {
    case 1:
      return <Chip label={t('pending')} skin='light' color='warning' />;
    case 2:
      return <Chip label={t('processed_partially')} skin='light' color='warning' />;
    case 3:
      return <Chip label={t('processed')} skin='light' color='success' />;
    case 4:
      return <Chip label={t('canceled')} skin='light' color='error' />;
  }
  return <Chip label={t('pending')} skin='light' color='warning' />;
};

/**
 * SaleOrder section index page
 * @returns SaleOrder page component
 */
const SaleOrder = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('saleOrders');
  const [tableState, setTableState] = useTableState('sale-orders');
  const [saleOrdersTableState, setSaleOrdersTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { saleOrderReducer: { saleOrders, currentSaleOrder, currentSaleOrderProduct, cursor, filteredCursor, filteredSaleOrders }, userReducer: { users }, saleOrderStatusReducer: { saleOrderStatuses }, warehouseReducer: { warehouses }, businessReducer: { businesses }, establishmentReducer: { establishments } } = useAppSelector((state) => state);

  // ** Vars

  /**
  * DataGrid Columns definition
  */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'orderedAt',
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
      field: 'pointOfSale',
      headerName: String(t('point_of_sale')),
      valueGetter: ({ row }: GridValueGetterParams) => row.pointOfSale.name
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
      minWidth: 200,
      field: 'status',
      headerName: String(t('status')),
      renderCell: ({ row }: GridRenderCellParams) => <StatusChip statusId={row.statusId} />
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
      field: 'billedAt',
      headerName: String(t('paid_at')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'seller',
      headerName: String(t('seller')),
      valueGetter: ({ row }: GridValueGetterParams) => row.seller.name
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
  const defaultColumnVisibility: GridColumnVisibilityModel = saleOrdersTableState.visibility ?? {
    orderedAt: true,
    identificationDocument: true,
    name: true,
    phone: false,
    email: false,
    address: false,
    business: false,
    establishment: true,
    pointOfSale: false,
    warehouse: false,
    status: true,
    expiresAt: false,
    billedAt: false,
    seller: false,
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
      field: 'ordered_at',
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
    // {
    //   field: 'point_of_sale',
    //   text: String(t('point_of_sale')),
    //   type: 'string',
    //   options: pointsOfSaleOrder.map((warehouse) => ({
    //     value: warehouse.id,
    //     text: warehouse.name
    //   }))
    // },
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
      field: 'status',
      text: String(t('status')),
      type: 'select',
      options: saleOrderStatuses.map((status) => ({
        value: status.id,
        text: status.name
      }))
    },
    {
      field: 'expires_at',
      text: String(t('expires_at')),
      type: 'date'
    },
    {
      field: 'billed_at',
      text: String(t('billed_at')),
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
      type: 'select',
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
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(saleOrdersTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(saleOrdersTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(saleOrdersTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openProductsAddDialog, setOpenProductsAddDialog] = useState<boolean>(false);
  const [openProductsCancelDialog, setOpenProductsCancelDialog] = useState<boolean>(false);
  const [openProductEditDialog, setOpenProductEditDialog] = useState<boolean>(false);
  const [openProductDeleteDialog, setOpenProductDeleteDialog] = useState<boolean>(false);
  const [openProductCancelDialog, setOpenProductCancelDialog] = useState<boolean>(false);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [productsAddLoading, setProductsAddLoading] = useState<boolean>(false);
  const [productsCancelLoading, setProductsCancelLoading] = useState<boolean>(false);
  const [productEditLoading, setProductEditLoading] = useState<boolean>(false);
  const [productCancelLoading, setProductCancelLoading] = useState<boolean>(false);
  const [productDeleteLoading, setProductDeleteLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    getProductDetails();
  }, []);

  useEffect(() => {
    if (!saleOrders.length || (filters && filters.length > 0) || (sortModel && sortModel.length > 0)) {
      getSaleOrders();
    } else {
      dispatch(setFilteredCursor(null));
      dispatch(resetFilteredSaleOrders());
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setSaleOrdersTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('sale-orders', saleOrdersTableState);
  }, [saleOrdersTableState]);

  /**
   * Get a list of saleOrders filtered, sorted and paginated
   */
  const getSaleOrders = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType | null = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType | null = generateSortQueryParams(sortModel) ?? generateSortQueryParams([{field: 'created_at', sort: 'desc'}]);
    try {
      const saleOrderResponse: IResponseCursorPagination<ISaleOrder> = await dispatch(getSaleOrdersAction({
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
    dispatch(setCurrentSaleOrder(row.row));
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor || filteredCursor) {
      getSaleOrders();
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
    // dispatch(setSaleOrderColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Details dialog close handler
   */
  const handleDetailsDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentSaleOrder(undefined));
    dispatch(setCurrentSaleOrderProduct(undefined));
  };

  /**
   * SaleOrder product edit button click handler
   * @param saleOrderProduct selected product to edit
   */
  const handleProductEditClick = (saleOrderProduct: MSaleOrderProduct) => {
    setOpenProductEditDialog(true);
    dispatch(setCurrentSaleOrderProduct(saleOrderProduct));
  };

  /**
   * SaleOrder product cancel button click handler
   * @param saleOrderProduct selected product to edit
   */
  const handleProductCancelClick = (saleOrderProduct: MSaleOrderProduct) => {
    setOpenProductCancelDialog(true);
    dispatch(setCurrentSaleOrderProduct(saleOrderProduct));
  };

  /**
   * SaleOrder product add edit dialog close handler
   */
  const handleProductEditDialogClose = () => {
    setOpenProductEditDialog(false);
    dispatch(setCurrentSaleOrderProduct(undefined));
  };

  /**
   * SaleOrder product cancel dialog close handler
   */
  const handleProductCancelDialogClose = () => {
    setOpenProductCancelDialog(false);
    dispatch(setCurrentSaleOrderProduct(undefined));
  };

  /**
   * SaleOrder product delete button click handler
   * @param saleOrderProduct selected product to edit
   */
  const handleProductDeleteClick = (saleOrderProduct: MSaleOrderProduct) => {
    setOpenProductDeleteDialog(true);
    dispatch(setCurrentSaleOrderProduct(saleOrderProduct));
  };

  /**
   * Product delete dialog close handler
   */
  const handleProductDeleteDialogClose = () => {
    setOpenProductDeleteDialog(false);
    dispatch(setCurrentSaleOrderProduct(undefined));
  };

  /**
   * SaleOrders section handlers
   */

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddSubmit = async (formFields: IAddSaleOrder) => {
    setAddLoading(true);
    console.log(formFields)
    try {
      await dispatch(addSaleOrderAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      setOpenDetailDialog(true);
      toast.success(t('sale_order_added_successfully'));
    } catch (error) {
      console.error('ADD SALE ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  }

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateSaleOrder) => {
    setEditLoading(true);
    console.log(formFields)
    try {
      await dispatch(updateSaleOrderAction(formFields)).then(unwrapResult);
      setOpenEditDialog(false);
      toast.success(t('sale_order_modified_successfully'));
    } catch (error) {
      console.error('ADD SALE ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  }

  /**
   * SaleOrder product add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleProductsAddSubmit = async (formFields: IAddSaleOrderProduct[]) => {
    setProductsAddLoading(true);
    try {
      await dispatch(addSaleOrderProductsAction(formFields)).then(unwrapResult);
      setOpenProductsAddDialog(false);
      toast.success(t('product_added_successfully'));
    } catch (error) {
      console.error('ADD/UPDATE SALE PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setProductsAddLoading(false);
  };

  /**
   * SaleOrder product add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleProductsCancelSubmit = async (formFields: IAddSaleOrderProduct[]) => {
    setProductsCancelLoading(true);
    try {
      await dispatch(addSaleOrderProductsAction(formFields)).then(unwrapResult);
      setOpenProductsAddDialog(false);
      toast.success(t('product_added_successfully'));
    } catch (error) {
      console.error('ADD/UPDATE SALE PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setProductsCancelLoading(false);
  };

  /**
   * SaleOrder product add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleProductEditSubmit = async (formFields: IUpdateSaleOrderProduct) => {
    setProductEditLoading(true);
    try {
      await dispatch(updateSaleOrderProductAction(formFields)).then(unwrapResult);
      handleProductEditDialogClose();
      toast.success(t('product_modified_successfully'));
    } catch (error) {
      console.error('ADD/UPDATE SALE PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setProductEditLoading(false);
  };

  /**
   * SaleOrder product cancel event submit handler
   * @param formFields form fields submitted by user
   */
  const handleProductCancelSubmit = async (formFields: ICancelSaleOrderProduct) => {
    setProductCancelLoading(true);
    try {
      await dispatch(cancelSaleOrderProductAction(formFields)).then(unwrapResult);
      handleProductCancelDialogClose();
      toast.success(t('product_cancelled_successfully'));
    } catch (error) {
      console.error('CANCEL SALE PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setProductCancelLoading(false);
  };

  /**
   * SaleOrder product delete event submit handler
   */
  const handleProductDeleteSubmit = async () => {
    setProductDeleteLoading(true);
    if (currentSaleOrderProduct) {
      try {
        await dispatch(deleteSaleOrderProductAction()).then(unwrapResult);
        setOpenProductDeleteDialog(false);
        dispatch(setCurrentSaleOrderProduct(undefined));
        toast.success(t('product_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_product_selected'));
    }
    setProductDeleteLoading(false);
  };

  /**
   * SaleOrder cancel event submit handler
   */
  const handleCancelSubmit = async () => {
    setCancelLoading(true);
    if (currentSaleOrder) {
      try {
        await dispatch(cancelSaleOrderAction()).then(unwrapResult);
        setOpenCancelDialog(false);
        toast.success(t('sale_order_canceled_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_sale_order_selected'));
    }
    setCancelLoading(false);
  };

  /**
   * SaleOrder delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentSaleOrder) {
      try {
        await dispatch(deleteSaleOrderAction()).then(unwrapResult);
        handleDetailsDialogClose();
        setOpenDeleteDialog(false);
        toast.success(t('sale_order_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_sale_order_selected'));
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
            canAdd={ability.can('create', 'sale_order')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredSaleOrders ?? saleOrders} 
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
        <SaleOrderDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onProductsAddClick={() => setOpenProductsAddDialog(true)}
          onProductsCancelClick={() => setOpenProductsCancelDialog(true)}
          onProductEditClick={handleProductEditClick}
          onProductCancelClick={handleProductCancelClick}
          onProductDeleteClick={handleProductDeleteClick}
          onCancelClick={() => setOpenCancelDialog(true)}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailsDialogClose}
        />
      }
      {openAddDialog &&
        <SaleOrderAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <SaleOrderEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openProductsAddDialog &&
        <SaleOrderProductsAddDialog
          open={openProductsAddDialog}
          loading={productsAddLoading}
          onSubmit={handleProductsAddSubmit}
          onClose={() => setOpenProductsAddDialog(false)}
        />
      }
      {openProductsCancelDialog &&
        <SaleOrderProductsCancelDialog
          open={openProductsCancelDialog}
          loading={productsCancelLoading}
          onSubmit={handleProductsCancelSubmit}
          onClose={() => setOpenProductsCancelDialog(false)}
        />
      }
      {openProductEditDialog &&
        <SaleOrderProductEditDialog
          open={openProductEditDialog}
          loading={productEditLoading}
          onSubmit={handleProductEditSubmit}
          onClose={handleProductEditDialogClose}
        />
      }
      {openProductCancelDialog &&
        <SaleOrderProductCancelDialog
          open={openProductCancelDialog}
          loading={productCancelLoading}
          onSubmit={handleProductCancelSubmit}
          onClose={handleProductCancelDialogClose}
        />
      }
      {openProductDeleteDialog &&
        <DeleteDialog
          open={openProductDeleteDialog} 
          loading={productDeleteLoading}
          onConfirm={handleProductDeleteSubmit}
          onClose={handleProductDeleteDialogClose}
        />
      }
      {openCancelDialog &&
        <ConfirmDialog
          open={openCancelDialog}
          loading={cancelLoading}
          title={String(t('cancel_order'))}
          message={String(t('cancel_order_confirmation_message'))}
          onConfirm={handleCancelSubmit}
          onClose={() => setOpenCancelDialog(false)}
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

SaleOrder.acl = {
  action: 'view',
  subject: 'sale_order'
} as ACLObj;

export default Page(SaleOrder);