// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addProductCostTypeAction, deleteProductCostTypeAction, updateProductCostTypeAction } from 'src/redux/actions/productCostType';
import { setCurrentProductCostType  } from "src/redux/reducers/productCostType";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateProductCostType } from 'src/interfaces/product/addUpdateCostType';

// ** MUI Imports
import { GridColDef, GridRowParams, DataGridPro } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';

// ** Icons Imports

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, setDataGridLocale } from 'src/utils/common';

// ** Custom components Imports
import ProductCostTypesAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";
import ProductCostTypesDetailDialog from "./components/DetailDialog";

/**
 * ProductCostTypes section index page
 * @returns ProductCostTypes page component
 */
const ProductCostTypes = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { productCostTypeReducer: { productCostTypes, currentProductCostType } } = useAppSelector((state) => state);
  // ** DataGrid Vars
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  // ** Dialog open flags
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // ** Loading flags
  const [addEditLoading, setAddEditLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  /**
   * Action buttons column service costs table
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
    dispatch(setCurrentProductCostType(row.row));
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
    dispatch(setCurrentProductCostType(undefined));
  };

  /**
   * ProductCostTypes delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentProductCostType(undefined));
  };

  /**
   * ProductCostTypes section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by productcosttypes
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateProductCostType) => {
    setAddEditLoading(true);
    try {
      if (currentProductCostType) {
        await dispatch(updateProductCostTypeAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        toast.success(t('cost_type_modified_successfully'));
      } else {
        await dispatch(addProductCostTypeAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        toast.success(t('cost_type_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT PRODUCT COST TYPES ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * ProductCostTypes delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentProductCostType) {
      try {
        await dispatch(deleteProductCostTypeAction()).then(unwrapResult);
        toast.success(t('cost_type_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_cost_type_selected'));
    }
    setDeleteLoading(false);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeaderAlt
            onAddClick={() => setOpenAddEditDialog(true)}
            onFilterChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilterValue(event.target.value)}
            canAdd={ability.can('create', 'product_cost_type')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={productCostTypes} 
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
        <ProductCostTypesDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenAddEditDialog(true)}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openAddEditDialog &&
        <ProductCostTypesAddEditDialog
          open={openAddEditDialog}
          loading={addEditLoading}
          onSubmit={handleAddEditSubmit}
          onClose={() => setOpenAddEditDialog(false)}
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

ProductCostTypes.acl = {
  action: 'view',
  subject: 'product_cost_type'
} as ACLObj;

export default Page(ProductCostTypes);
