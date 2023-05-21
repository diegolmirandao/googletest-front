// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addProductCategoryAction, deleteProductCategoryAction, updateProductCategoryAction } from 'src/redux/actions/productCategory';
import { addProductSubcategoryAction, updateProductSubcategoryAction, deleteProductSubcategoryAction } from "src/redux/actions/productCategory";
import { setCurrentProductCategory, setCurrentProductSubcategory  } from "src/redux/reducers/productCategory";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddProductCategory } from 'src/interfaces/product/addCategory';
import { IUpdateProductCategory } from 'src/interfaces/product/updateCategory';
import { MProductCategory } from "src/models/product/category";
import { MProductSubcategory } from "src/models/product/subcategory";
import { IAddUpdateProductSubcategory } from "src/interfaces/product/addUpdateSubcategory";

// ** MUI Imports
import { GridColDef, GridRowParams, DataGridPro } from '@mui/x-data-grid-pro';
import { Card, Grid, Box, Tooltip } from '@mui/material';

// ** Icons Imports

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, setDataGridLocale } from 'src/utils/common';

// ** Custom components Imports
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";
import ProductCategoryAddDialog from "./components/AddDialog";
import ProductCategoryDetailDialog from "./components/DetailDialog";
import ProductCategoryEditDialog from "./components/EditDialog";
import ProductSubcategoryAddEditDialog from "./components/SubcategoryAddEditDialog";

/**
 * ProductCategory section index page
 * @returns ProductCategory page component
 */
const ProductCategory = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { productCategoryReducer: { productCategories, currentProductCategory, currentProductSubcategory } } = useAppSelector((state) => state);
  // ** DataGrid Vars
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  // ** Dialog open flags
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openSubcategoryAddEditDialog, setOpenSubcategoryAddEditDialog] = useState<boolean>(false);
  const [openSubcategoryDeleteDialog, setOpenSubcategoryDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // ** Loading flags
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [subcategoryAddEditLoading, setSubcategoryAddEditLoading] = useState<boolean>(false);
  const [subcategoryDeleteLoading, setSubcategoryDeleteLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  /**
   * Action buttons column service prices table
   */
  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: String(t('name'))
    }
  ];

  /**
   * DataGrid Table handlers
   */

  /**
   * DataGrid row clicked handler
   * @param row Row clicked information
   */
  const handleRowClick = (row: GridRowParams) => {
    dispatch(setCurrentProductCategory(row.row));
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
    dispatch(setCurrentProductCategory(undefined));
    dispatch(setCurrentProductSubcategory(undefined));
  };

  /**
   * Product subcategory edit button click handler
   * @param subcategory selected subcategory to edit
   */
  const handleSubcategoryEditClick = (subcategory: MProductSubcategory) => {
    setOpenSubcategoryAddEditDialog(true);
    dispatch(setCurrentProductSubcategory(subcategory));
  };

  /**
   * Product subcategory edit dialog close handler
   */
  const handleSubcategoryEditDialogClose = () => {
    setOpenSubcategoryAddEditDialog(false);
    dispatch(setCurrentProductSubcategory(undefined));
  };

  /**
   * Product subcategory delete button click handler
   * @param subcategory selected subcategory to delete
   */
  const handleSubcategoryDeleteClick = (subcategory: MProductSubcategory) => {
    setOpenSubcategoryDeleteDialog(true);
    dispatch(setCurrentProductSubcategory(subcategory));
  };

  /**
   * Product subcategory delete dialog close handler
   */
  const handleSubcategoryDeleteDialogClose = () => {
    setOpenSubcategoryDeleteDialog(false);
    dispatch(setCurrentProductSubcategory(undefined));
  };

  /**
   * ProductCategory delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentProductCategory(undefined));
    dispatch(setCurrentProductSubcategory(undefined));
  };

  /**
   * Product Category section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by product category
   */
  const handleAddSubmit = async (formFields: IAddProductCategory) => {
    setAddLoading(true);
    try {
      await dispatch(addProductCategoryAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      toast.success(t('category_added_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT CATEGORY ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  };

  /**
   * Form submit handler
   * @param formFields form fields submitted by product category
   */
  const handleEditSubmit = async (formFields: IUpdateProductCategory) => {
    setEditLoading(true);
    try {
        await dispatch(updateProductCategoryAction(formFields)).then(unwrapResult);
        setOpenEditDialog(false);
        toast.success(t('category_modified_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT CATEGORY ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  };

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by productSubcategory
   */
  const handleSubcategoryAddEditSubmit = async (formFields: IAddUpdateProductSubcategory) => {
    setSubcategoryAddEditLoading(true);
    try {
      if (currentProductSubcategory) {
        await dispatch(updateProductSubcategoryAction(formFields)).then(unwrapResult);
        handleSubcategoryEditDialogClose();
        toast.success(t('subcategory_modified_successfully'));
      } else {
        await dispatch(addProductSubcategoryAction(formFields)).then(unwrapResult);
        setOpenSubcategoryAddEditDialog(false);
        toast.success(t('subcategory_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/EDIT PRODUCT SUBCATEGORY ERROR: ', error);
      displayErrors(error);
    }
    setSubcategoryAddEditLoading(false);
  }

  /**
   * ProductSubcategory delete event submit handler
   */
  const handleSubcategoryDeleteSubmit = async () => {
    setSubcategoryDeleteLoading(true);
    if (currentProductSubcategory) {
      try {
        await dispatch(deleteProductSubcategoryAction()).then(unwrapResult);
        toast.success(t('subcategory_deleted_successfully'));
        handleSubcategoryDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_subcategory_selected'));
    }
    setSubcategoryDeleteLoading(false);
  };

  /**
   * ProductCategory delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentProductCategory) {
      try {
        await dispatch(deleteProductCategoryAction()).then(unwrapResult);
        toast.success(t('category_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_category_selected'));
    }
    setDeleteLoading(false);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeaderAlt
            onAddClick={() => setOpenAddDialog(true)}
            onFilterChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilterValue(event.target.value)}
            canAdd={ability.can('create', 'product_category')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={productCategories} 
              localeText={setDataGridLocale()}
              loading={tableLoading}
              filterModel={{
                items: [{ field: 'name', operator: 'contains', value: filterValue }]
              }}
              onRowClick={handleRowClick}
              disableColumnMenu={true}
              hideFooterSelectedRowCount
              disableRowSelectionOnClick
            />
          </Box>
        </Card>
      </Grid>

      {openDetailDialog &&
        <ProductCategoryDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onSubcategoryAddClick={() => setOpenSubcategoryAddEditDialog(true)}
          onSubcategoryEditClick={handleSubcategoryEditClick}
          onSubcategoryDeleteClick={handleSubcategoryDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openAddDialog &&
        <ProductCategoryAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <ProductCategoryEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openSubcategoryAddEditDialog &&
        <ProductSubcategoryAddEditDialog
          open={openSubcategoryAddEditDialog}
          loading={subcategoryAddEditLoading}
          onSubmit={handleSubcategoryAddEditSubmit}
          onClose={handleSubcategoryEditDialogClose}
        />
      }
      {openSubcategoryDeleteDialog &&
        <DeleteDialog
          open={openSubcategoryDeleteDialog}
          loading={subcategoryDeleteLoading}
          onConfirm={handleSubcategoryDeleteSubmit}
          onClose={handleSubcategoryDeleteDialogClose}
        />
      }
      {openDeleteDialog &&
        <DeleteDialog
          open={openDeleteDialog}
          loading={deleteLoading}
          onConfirm={handleDeleteSubmit}
          onClose={handleDeleteDialogClose}
        />
      }
    </Grid>
  )
};

ProductCategory.acl = {
  action: 'view',
  subject: 'product_category'
} as ACLObj;

export default Page(ProductCategory);
