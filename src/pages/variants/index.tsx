// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addVariantAction, deleteVariantAction, updateVariantAction } from 'src/redux/actions/variant';
import { addVariantOptionAction, updateVariantOptionAction, deleteVariantOptionAction } from "src/redux/actions/variant";
import { setCurrentVariant, setCurrentVariantOption  } from "src/redux/reducers/variant";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddVariant } from 'src/interfaces/product/addVariant';
import { IUpdateVariant } from 'src/interfaces/product/updateVariant';
import { MVariantOption } from "src/models/product/variantOption";
import { IAddUpdateVariantOption } from "src/interfaces/product/addUpdateVariantOption";

// ** MUI Imports
import { GridColDef, GridRowParams, DataGridPro, GridValueFormatterParams } from '@mui/x-data-grid-pro';
import { Card, Grid, Box } from '@mui/material';

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
import VariantAddDialog from "./components/AddDialog";
import VariantDetailDialog from "./components/DetailDialog";
import VariantEditDialog from "./components/EditDialog";
import VariantOptionAddEditDialog from "./components/OptionAddEditDialog";

/**
 * Variant section index page
 * @returns Variant page component
 */
const Variant = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { variantReducer: { variants, currentVariant, currentVariantOption } } = useAppSelector((state) => state);
  // ** DataGrid Vars
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  // ** Dialog open flags
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openOptionAddEditDialog, setOpenOptionAddEditDialog] = useState<boolean>(false);
  const [openOptionDeleteDialog, setOpenOptionDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // ** Loading flags
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [optionAddEditLoading, setOptionAddEditLoading] = useState<boolean>(false);
  const [optionDeleteLoading, setOptionDeleteLoading] = useState<boolean>(false);
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
    dispatch(setCurrentVariant(row.row));
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
    dispatch(setCurrentVariant(undefined));
    dispatch(setCurrentVariantOption(undefined));
  };

  /**
   * Product option edit button click handler
   * @param option selected option to edit
   */
  const handleOptionEditClick = (option: MVariantOption) => {
    setOpenOptionAddEditDialog(true);
    dispatch(setCurrentVariantOption(option));
  };

  /**
   * Product option edit dialog close handler
   */
  const handleOptionEditDialogClose = () => {
    setOpenOptionAddEditDialog(false);
    dispatch(setCurrentVariantOption(undefined));
  };

  /**
   * Product option delete button click handler
   * @param option selected option to delete
   */
  const handleOptionDeleteClick = (option: MVariantOption) => {
    setOpenOptionDeleteDialog(true);
    dispatch(setCurrentVariantOption(option));
  };

  /**
   * Product option delete dialog close handler
   */
  const handleOptionDeleteDialogClose = () => {
    setOpenOptionDeleteDialog(false);
    dispatch(setCurrentVariantOption(undefined));
  };

  /**
   * Variant delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentVariant(undefined));
    dispatch(setCurrentVariantOption(undefined));
  };

  /**
   * Product Variant section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by product variant
   */
  const handleAddSubmit = async (formFields: IAddVariant) => {
    setAddLoading(true);
    try {
      await dispatch(addVariantAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      toast.success(t('variant_added_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT VARIANT ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  };

  /**
   * Form submit handler
   * @param formFields form fields submitted by product variant
   */
  const handleEditSubmit = async (formFields: IUpdateVariant) => {
    setEditLoading(true);
    try {
        await dispatch(updateVariantAction(formFields)).then(unwrapResult);
        setOpenEditDialog(false);
        toast.success(t('variant_modified_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT VARIANT ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  };

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by variantOption
   */
  const handleOptionAddEditSubmit = async (formFields: IAddUpdateVariantOption) => {
    setOptionAddEditLoading(true);
    try {
      if (currentVariantOption) {
        await dispatch(updateVariantOptionAction(formFields)).then(unwrapResult);
        handleOptionEditDialogClose();
        toast.success(t('option_modified_successfully'));
      } else {
        await dispatch(addVariantOptionAction(formFields)).then(unwrapResult);
        setOpenOptionAddEditDialog(false);
        toast.success(t('option_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/EDIT PRODUCT OPTION ERROR: ', error);
      displayErrors(error);
    }
    setOptionAddEditLoading(false);
  }

  /**
   * VariantOption delete event submit handler
   */
  const handleOptionDeleteSubmit = async () => {
    setOptionDeleteLoading(true);
    if (currentVariantOption) {
      try {
        await dispatch(deleteVariantOptionAction()).then(unwrapResult);
        toast.success(t('option_deleted_successfully'));
        handleOptionDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_option_selected'));
    }
    setOptionDeleteLoading(false);
  };

  /**
   * Variant delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentVariant) {
      try {
        await dispatch(deleteVariantAction()).then(unwrapResult);
        toast.success(t('variant_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_variant_selected'));
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
            canAdd={ability.can('create', 'variant')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={variants} 
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
        <VariantDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onOptionAddClick={() => setOpenOptionAddEditDialog(true)}
          onOptionEditClick={handleOptionEditClick}
          onOptionDeleteClick={handleOptionDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openAddDialog &&
        <VariantAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <VariantEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openOptionAddEditDialog &&
        <VariantOptionAddEditDialog
          open={openOptionAddEditDialog}
          loading={optionAddEditLoading}
          onSubmit={handleOptionAddEditSubmit}
          onClose={handleOptionEditDialogClose}
        />
      }
      {openOptionDeleteDialog &&
        <DeleteDialog
          open={openOptionDeleteDialog}
          loading={optionDeleteLoading}
          onConfirm={handleOptionDeleteSubmit}
          onClose={handleOptionDeleteDialogClose}
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

Variant.acl = {
  action: 'view',
  subject: 'variant'
} as ACLObj;

export default Page(Variant);
