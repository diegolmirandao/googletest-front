// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addBrandAction, deleteBrandAction, updateBrandAction } from 'src/redux/actions/brand';
import { setCurrentBrand  } from "src/redux/reducers/brand";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateBrand } from 'src/interfaces/product/addUpdateBrand';

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
import BrandAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";
import BrandDetailDialog from "./components/DetailDialog";

/**
 * Brand section index page
 * @returns Brand page component
 */
const Brand = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { brandReducer: { brands, currentBrand } } = useAppSelector((state) => state);
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
    dispatch(setCurrentBrand(row.row));
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
    dispatch(setCurrentBrand(undefined));
  };

  /**
   * Brand delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentBrand(undefined));
  };

  /**
   * Brand section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by brand
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateBrand) => {
    setAddEditLoading(true);
    try {
      if (currentBrand) {
        await dispatch(updateBrandAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        toast.success(t('brand_modified_successfully'));
      } else {
        await dispatch(addBrandAction(formFields)).then(unwrapResult);
        setOpenAddEditDialog(false);
        toast.success(t('brand_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT BRAND ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * Brand delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentBrand) {
      try {
        await dispatch(deleteBrandAction()).then(unwrapResult);
        toast.success(t('brand_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_brand_selected'));
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
            canAdd={ability.can('create', 'brand')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={brands} 
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
        <BrandDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenAddEditDialog(true)}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openAddEditDialog &&
        <BrandAddEditDialog
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

Brand.acl = {
  action: 'view',
  subject: 'brand'
} as ACLObj;

export default Page(Brand);
