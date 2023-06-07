// ** React Imports
import { useContext, useEffect, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addProductAction, addProductDetailCostAction, addProductDetailPriceAction, deleteProductAction, deleteProductDetailAction, deleteProductDetailCostAction, deleteProductDetailPriceAction, getProductsAction, updateProductAction, updateProductDetailCostAction, updateProductDetailPriceAction } from 'src/redux/actions/product';
import { setCurrentProduct, setFilteredCursor, resetFilteredProducts, setCurrentProductDetail, setCurrentProductDetailPrice, setCurrentProductDetailCost } from 'src/redux/reducers/product';

// ** Interfaces and Types Imports
import { ACLObj } from 'src/config/acl';
import { IResponseCursorPagination } from "src/interfaces/responseCursorPagination";
import { IAddProduct } from "src/interfaces/product/add";
import { IUpdateProduct } from 'src/interfaces/product/update';
import { IProduct } from 'src/interfaces/product/product';
import { ITableFilter, ITableFilterApplied } from 'src/interfaces/tableFilter';
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import FilterQueryType from "src/types/FilterQueryType";
import SortQueryType from "src/types/SortQueryType";
import { ITableState } from "src/interfaces/tableState";
import { MProductDetailCost } from "src/models/product/detailCost";
import { IAddUpdateProductDetailCost } from "src/interfaces/product/addUpdateDetailCost";
import { MProductDetailPrice } from "src/models/product/detailPrice";
import { IAddUpdateProductDetailPrice } from "src/interfaces/product/addDetailPrice";

// ** MUI Imports
import { GridColDef, GridSortModel, GridValueGetterParams, GridRowParams, GridColumnVisibilityModel, DataGridPro,  GridRowScrollEndParams, MuiEvent, GridCallbackDetails, GridValueFormatterParams, GridColumnOrderChangeParams, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';
import Chip from "src/components/mui/chip";

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, generateFilterQueryParams, generateSortQueryParams, setDataGridLocale } from 'src/utils/common';
import { formatDate, formatNumber } from 'src/utils/format';
import useRequestParam from "src/hooks/useRequestParams";

// ** Custom components Imports
import TableHeader from 'src/components/table/TableHeader';
import TableFilter from 'src/components/table/TableFilter';
import ProductAddDialog from './components/AddDialog';
import ProductEditDialog from './components/EditDialog';
import ProductDetailDialog from './components/DetailDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableExportDialog from 'src/components/table/TableExportDialog';
import TableColumnVisibilityDialog from 'src/components/table/TableColumnVisibilityDialog';
import Page from "src/components/Page";
import useTableState from "src/hooks/useTableState";
import ProductDetailPriceAddEditDialog from "./components/DetailPriceAddEditDialog";
import ProductDetailCostAddEditDialog from "./components/DetailCostAddEditDialog";
import { MProductDetail } from "src/models/product/detail";

/**
 * Export columns definition
 */
const exportColumns: ITableExportColumn[] = [
  {
    field: 'code',
    text: 'code'
  },
  {
    field: 'name',
    text: 'name'
  },
  {
    field: 'status',
    text: 'status'
  },
  {
    field: 'category',
    text: 'category'
  },
  {
    field: 'subcategory',
    text: 'subcategory'
  },
  {
    field: 'brand',
    text: 'brand'
  },
  {
    field: 'type',
    text: 'type'
  },
  {
    field: 'measurement_unit',
    text: 'measurement_unit'
  },
  {
    field: 'tax',
    text: 'vat'
  },
  {
    field: 'description',
    text: 'description'
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
 * Product section index page
 * @returns Product page component
 */
const Product = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  const requestParams = useRequestParam('products');
  const [tableState, setTableState] = useTableState('products');
  const [productsTableState, setProductsTableState] = useState<ITableState>(tableState);

  // ** Reducers
  const { productReducer: { products, currentProduct, currentProductDetail, currentProductDetailPrice, currentProductDetailCost, cursor, filteredCursor, filteredProducts }, productCategoryReducer: { productCategories }, brandReducer: { brands }, productTypeReducer: { productTypes }, measurementUnitReducer: { measurementUnits } } = useAppSelector((state) => state);

  // ** Vars
  const productSubcategories = productCategories.map(category => category.subcategories!).flat();
  /**
  * DataGrid Columns definition
  */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'code',
      headerName: String(t('code')),
      valueGetter: ({ row }: GridValueGetterParams) => row.codes[0]
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
      field: 'category',
      headerName: String(t('category')),
      valueGetter: ({ row }: GridValueGetterParams) => row.category.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'subcategory',
      headerName: String(t('subcategory')),
      valueGetter: ({ row }: GridValueGetterParams) => row.subcategory.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'brand',
      headerName: String(t('brand')),
      valueGetter: ({ row }: GridValueGetterParams) => row.brand.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'type',
      headerName: String(t('type')),
      valueGetter: ({ row }: GridValueGetterParams) => row.type.name
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'measurementUnit',
      headerName: String(t('measurement_unit')),
      valueGetter: ({ row }: GridValueGetterParams) => row.measurementUnit.name
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'tax',
      headerName: String(t('vat')),
      valueFormatter: ({ value }: GridValueFormatterParams) => `${formatNumber(value)} %`
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: String(t('status')),
      renderCell: ({ row }: GridRenderCellParams) => (
        row.status ? <Chip label={t('active')} skin='light' color='success' /> : <Chip label={t('inactive')} skin='light' color='error' />
      )
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'description',
      headerName: String(t('description'))
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
  const defaultColumnVisibility: GridColumnVisibilityModel = productsTableState.visibility ?? {
    code: true,
    name: true,
    status: true,
    category: true,
    subcategory: true,
    brand: true,
    type: false,
    measurementUnit: false,
    tax: false,
    description: false,
    createdAt: false,
    updatedAt: false
  };

  /**
  * Filter fields definition
  */
  const filtersFields: ITableFilter[] = [
    {
      field: 'code',
      text: String(t('code')),
      type: 'string'
    },
    {
      field: 'name',
      text: String(t('name')),
      type: 'string'
    },
    {
      field: 'status',
      text: 'Estado',
      type: 'boolean'
    },
    {
      field: 'category',
      text: String(t('category')),
      type: 'select',
      options: productCategories.map((category) => ({
        value: category.id,
        text: category.name
      }))
    },
    {
      field: 'subcategory_id',
      text: String(t('subcategory')),
      type: 'select',
      options: productSubcategories.map((subcategory) => ({
        value: subcategory.id,
        text: subcategory.name
      }))
    },
    {
      field: 'brand_id',
      text: String(t('brand')),
      type: 'select',
      options: brands.map((brand) => ({
        value: brand.id,
        text: brand.name
      }))
    },
    {
      field: 'type_id',
      text: String(t('type')),
      type: 'select',
      options: productTypes.map((type) => ({
        value: type.id,
        text: type.name
      }))
    },
    {
      field: 'measurement_unit_id',
      text: String(t('measurement_unit')),
      type: 'select',
      options: measurementUnits.map((measurementUnit) => ({
        value: measurementUnit.id,
        text: measurementUnit.name
      }))
    },
    {
      field: 'tax',
      text: String(t('vat')),
      type: 'numeric'
    },
    {
      field: 'description',
      text: String(t('description')),
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
  const [filters, setFilters] = useState<ITableFilterApplied[] | undefined>(productsTableState.filters);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(productsTableState.sorts);
  const [visibilityModel, setVisibilityModel] = useState<GridColumnVisibilityModel>(defaultColumnVisibility);
  const [exportData, setExportData] = useState<ITableExport | undefined>(productsTableState.export);

  // ** Dialog open flags
  const [openTableExportDialog, setOpenTableExportDialog] = useState<boolean>(false);
  const [openTableColumnVisibilityDialog, setOpenTableColumnVisibilityDialog] = useState<boolean>(false);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openDetailDetailDialog, setOpenDetailDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDetailDeleteDialog, setOpenDetailDeleteDialog] = useState<boolean>(false);
  const [openPriceAddEditDialog, setOpenPriceAddEditDialog] = useState<boolean>(false);
  const [openPriceDeleteDialog, setOpenPriceDeleteDialog] = useState<boolean>(false);
  const [openCostAddEditDialog, setOpenCostAddEditDialog] = useState<boolean>(false);
  const [openCostDeleteDialog, setOpenCostDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // ** Loading flags
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [detailDeleteLoading, setDetailDeleteLoading] = useState<boolean>(false);
  const [priceAddEditLoading, setPriceAddEditLoading] = useState<boolean>(false);
  const [priceDeleteLoading, setPriceDeleteLoading] = useState<boolean>(false);
  const [costAddEditLoading, setCostAddEditLoading] = useState<boolean>(false);
  const [costDeleteLoading, setCostDeleteLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!products.length || (filters && filters.length > 0) || (sortModel && sortModel.length > 0)) {
      getProducts();
    } else {
      dispatch(setFilteredCursor(null));
      dispatch(resetFilteredProducts());
    }
  }, [filters, sortModel]);

  useEffect(() => {
    setProductsTableState({
      columns: undefined,
      filters: filters,
      sorts: sortModel,
      visibility: visibilityModel,
      export: exportData
    });
  }, [filters, sortModel, visibilityModel, exportData]);

  useEffect(() => {
    setTableState('products', productsTableState);
  }, [productsTableState]);

  /**
   * Get a list of products filtered, sorted and paginated
   */
  const getProducts = async () => {
    setTableLoading(true);
    const appliedFilters: FilterQueryType | null = generateFilterQueryParams(filters);
    const appliedSortings: SortQueryType | null = generateSortQueryParams(sortModel) ?? generateSortQueryParams([{field: 'created_at', sort: 'desc'}]);
    try {
      const productResponse: IResponseCursorPagination<IProduct> = await dispatch(getProductsAction({
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
    dispatch(setCurrentProduct(row.row));
    if (row.row.details[0].variants.length == 0) {
      dispatch(setCurrentProductDetail(row.row.details[0]));
    }
    setOpenDetailDialog(true);
  };

  /**
   * onRowsScrollEnd handler
   */
  const handleRowsScrollEnd = (params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => {
    if (cursor || filteredCursor) {
      getProducts();
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
    // dispatch(setProductColumns(changedColumns));
  }

  /**
   * Dialog functions and handlers
   */

  /**
   * Product detail information click handler
   */
  const handleDetailInformationClick = (productDetail: MProductDetail) => {
    dispatch(setCurrentProductDetail(productDetail));
    setOpenDetailDetailDialog(true);
  };

  /**
   * Details dialog close handler
   */
  const handleDetailsDialogClose = () => {
    setOpenDetailDialog(false);
    dispatch(setCurrentProduct(undefined));
    dispatch(setCurrentProductDetail(undefined));
    dispatch(setCurrentProductDetailPrice(undefined));
  };

  /**
   * Details dialog close handler
   */
  const handleDetailDetailDialogClose = () => {
    setOpenDetailDetailDialog(false);
    dispatch(setCurrentProductDetail(undefined));
    dispatch(setCurrentProductDetailPrice(undefined));
  };

  /**
   * Detail delete dialog close handler
   */
  const handleDetailDeleteDialogClose = () => {
    setOpenDetailDeleteDialog(false);
    dispatch(setCurrentProductDetail(undefined));
    dispatch(setCurrentProductDetailPrice(undefined));
  };

  /**
   * Product detail price edit button click handler
   * @param price selected detail price to edit
   */
  const handlePriceEditClick = (price: MProductDetailPrice) => {
    setOpenPriceAddEditDialog(true);
    dispatch(setCurrentProductDetailPrice(price));
  };

  /**
   * Product detail price add edit dialog close handler
   */
  const handlePriceAddEditDialogClose = () => {
    setOpenPriceAddEditDialog(false);
    dispatch(setCurrentProductDetailPrice(undefined));
  };

  /**
   * Product detail price delete button click handler
   * @param price selected detail price to delete
   */
  const handlePriceDeleteClick = (price: MProductDetailPrice) => {
    setOpenPriceDeleteDialog(true);
    dispatch(setCurrentProductDetailPrice(price));
  };

  /**
   * Price delete dialog close handler
   */
  const handlePriceDeleteDialogClose = () => {
    setOpenPriceDeleteDialog(false);
    dispatch(setCurrentProductDetailPrice(undefined));
  };

  /**
   * Product detail cost edit button click handler
   * @param cost selected detail cost to edit
   */
  const handleCostEditClick = (cost: MProductDetailCost) => {
    setOpenCostAddEditDialog(true);
    dispatch(setCurrentProductDetailCost(cost));
  };

  /**
   * Product detail cost add edit dialog close handler
   */
  const handleCostAddEditDialogClose = () => {
    setOpenCostAddEditDialog(false);
    dispatch(setCurrentProductDetailCost(undefined));
  };

  /**
   * Product detail cost delete button click handler
   * @param cost selected detail cost to delete
   */
  const handleCostDeleteClick = (cost: MProductDetailCost) => {
    setOpenCostDeleteDialog(true);
    dispatch(setCurrentProductDetailCost(cost));
  };

  /**
   * Cost delete dialog close handler
   */
  const handleCostDeleteDialogClose = () => {
    setOpenCostDeleteDialog(false);
    dispatch(setCurrentProductDetailCost(undefined));
  };

  /**
   * Products section handlers
   */

  /**
   * Form add submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddSubmit = async (formFields: IAddProduct) => {
    setAddLoading(true);
    console.log(formFields)
    try {
      await dispatch(addProductAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      setOpenDetailDialog(true);
      toast.success(t('product_added_successfully'));
    } catch (error) {
      console.error('ADD PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  }

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by user
   */
  const handleEditSubmit = async (formFields: IUpdateProduct) => {
    setEditLoading(true);
    try {
      await dispatch(updateProductAction(formFields)).then(unwrapResult);
      setOpenEditDialog(false);
      toast.success(t('product_modified_successfully'));
    } catch (error) {
      console.error('EDIT PRODUCT ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  }

  /**
   * Product detail delete event submit handler
   */
  const handleDetailDeleteSubmit = async () => {
    setDetailDeleteLoading(true);
    if (currentProductDetail) {
      try {
        await dispatch(deleteProductDetailAction()).then(unwrapResult);
        handleDetailDeleteDialogClose();
        setOpenDetailDetailDialog(false);
        toast.success(t('product_detail_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_product_detail_selected'));
    }
    setDetailDeleteLoading(false);
  };

  /**
   * Form price edit submit handler
   * @param formFields form fields submitted by user
   */
  const handlePriceAddEditSubmit = async (formFields: IAddUpdateProductDetailPrice) => {
    setPriceAddEditLoading(true);
    try {
      if (currentProductDetailPrice) {
        await dispatch(updateProductDetailPriceAction(formFields)).then(unwrapResult);
        handlePriceAddEditDialogClose();
        toast.success(t('price_modified_successfully'));
      } else {
        await dispatch(addProductDetailPriceAction(formFields)).then(unwrapResult);
        handlePriceAddEditDialogClose();
        toast.success(t('price_added_successfully'));
      }
    } catch (error) {
      console.error('EDIT PRODUCT DETAIL PRICE ERROR: ', error);
      displayErrors(error);
    }
    setPriceAddEditLoading(false);
  }
  
  /**
   * Product delete event submit handler
   */
  const handlePriceDeleteSubmit = async () => {
    setPriceDeleteLoading(true);
    if (currentProductDetailPrice) {
      try {
        await dispatch(deleteProductDetailPriceAction()).then(unwrapResult);
        handlePriceDeleteDialogClose();
        toast.success(t('price_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_price_selected'));
    }
    setPriceDeleteLoading(false);
  };

  /**
   * Form cost edit submit handler
   * @param formFields form fields submitted by user
   */
  const handleCostAddEditSubmit = async (formFields: IAddUpdateProductDetailCost) => {
    setCostAddEditLoading(true);
    try {
      if (currentProductDetailCost) {
        await dispatch(updateProductDetailCostAction(formFields)).then(unwrapResult);
        handleCostAddEditDialogClose();
        toast.success(t('cost_modified_successfully'));
      } else {
        await dispatch(addProductDetailCostAction(formFields)).then(unwrapResult);
        handleCostAddEditDialogClose();
        toast.success(t('cost_added_successfully'));
      }
    } catch (error) {
      console.error('EDIT PRODUCT DETAIL COST ERROR: ', error);
      displayErrors(error);
    }
    setCostAddEditLoading(false);
  }
  
  /**
   * Product delete event submit handler
   */
  const handleCostDeleteSubmit = async () => {
    setCostDeleteLoading(true);
    if (currentProductDetailCost) {
      try {
        await dispatch(deleteProductDetailCostAction()).then(unwrapResult);
        handleCostDeleteDialogClose();
        toast.success(t('cost_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_cost_selected'));
    }
    setCostDeleteLoading(false);
  };

  /**
   * Product delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentProduct) {
      try {
        await dispatch(deleteProductAction()).then(unwrapResult);
        handleDetailsDialogClose();
        setOpenDeleteDialog(false);
        toast.success(t('product_deleted_successfully'));
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_product_selected'));
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
            canAdd={ability.can('create', 'product')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={filteredProducts ?? products} 
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
        <ProductDetailDialog
          open={openDetailDialog}
          onDetailInformationClick={handleDetailInformationClick}
          onEditClick={() => setOpenEditDialog(true)}
          onPriceAddClick={() => setOpenPriceAddEditDialog(true)}
          onPriceEditClick={handlePriceEditClick}
          onPriceDeleteClick={handlePriceDeleteClick}
          onCostAddClick={() => setOpenCostAddEditDialog(true)}
          onCostEditClick={handleCostEditClick}
          onCostDeleteClick={handleCostDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailsDialogClose}
        />
      }
      {openDetailDetailDialog &&
        <ProductDetailDialog
          open={openDetailDetailDialog}
          onDetailInformationClick={() => {}}
          onEditClick={() => setOpenEditDialog(true)}
          onPriceAddClick={() => setOpenPriceAddEditDialog(true)}
          onPriceEditClick={handlePriceEditClick}
          onPriceDeleteClick={handlePriceDeleteClick}
          onCostAddClick={() => setOpenCostAddEditDialog(true)}
          onCostEditClick={handleCostEditClick}
          onCostDeleteClick={handleCostDeleteClick}
          onDeleteClick={() => setOpenDetailDeleteDialog(true)}
          onClose={handleDetailDetailDialogClose}
        />
      }
      {openAddDialog &&
        <ProductAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <ProductEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openDetailDeleteDialog &&
        <DeleteDialog
          open={openDetailDeleteDialog}
          loading={detailDeleteLoading}
          onConfirm={handleDetailDeleteSubmit}
          onClose={handleDetailDeleteDialogClose}
        />
      }
      {openPriceAddEditDialog &&
        <ProductDetailPriceAddEditDialog
          open={openPriceAddEditDialog}
          loading={priceAddEditLoading}
          onSubmit={handlePriceAddEditSubmit}
          onClose={handlePriceAddEditDialogClose}
        />
      }
      {openPriceDeleteDialog &&
        <DeleteDialog
          open={openPriceDeleteDialog}
          loading={priceDeleteLoading}
          onConfirm={handlePriceDeleteSubmit}
          onClose={handlePriceDeleteDialogClose}
        />
      }
      {openCostAddEditDialog &&
        <ProductDetailCostAddEditDialog
          open={openCostAddEditDialog}
          loading={costAddEditLoading}
          onSubmit={handleCostAddEditSubmit}
          onClose={handleCostAddEditDialogClose}
        />
      }
      {openCostDeleteDialog &&
        <DeleteDialog
          open={openCostDeleteDialog}
          loading={costDeleteLoading}
          onConfirm={handleCostDeleteSubmit}
          onClose={handleCostDeleteDialogClose}
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

Product.acl = {
  action: 'view',
  subject: 'product'
} as ACLObj;

export default Page(Product);