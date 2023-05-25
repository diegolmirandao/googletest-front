// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addPropertyAction, deletePropertyAction, updatePropertyAction } from 'src/redux/actions/property';
import { addPropertyOptionAction, updatePropertyOptionAction, deletePropertyOptionAction } from "src/redux/actions/property";
import { setCurrentProperty, setCurrentPropertyOption  } from "src/redux/reducers/property";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddProperty } from 'src/interfaces/product/addProperty';
import { IUpdateProperty } from 'src/interfaces/product/updateProperty';
import { MPropertyOption } from "src/models/product/propertyOption";
import { IAddUpdatePropertyOption } from "src/interfaces/product/addUpdatePropertyOption";
import { EPropertyType } from "src/enums/propertyType";
import { PropertyTypeType } from "src/types/propertyTypeType";

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
import PropertyAddDialog from "./components/AddDialog";
import PropertyDetailDialog from "./components/DetailDialog";
import PropertyEditDialog from "./components/EditDialog";
import PropertyOptionAddEditDialog from "./components/OptionAddEditDialog";

/**
 * Property section index page
 * @returns Property page component
 */
const Property = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { propertyReducer: { properties, currentProperty, currentPropertyOption } } = useAppSelector((state) => state);
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
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'type',
      headerName: 'Tipo',
      valueFormatter: ({ value }: GridValueFormatterParams) => t(EPropertyType[value as PropertyTypeType])
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
    dispatch(setCurrentProperty(row.row));
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
    dispatch(setCurrentProperty(undefined));
    dispatch(setCurrentPropertyOption(undefined));
  };

  /**
   * Product option edit button click handler
   * @param option selected option to edit
   */
  const handleOptionEditClick = (option: MPropertyOption) => {
    setOpenOptionAddEditDialog(true);
    dispatch(setCurrentPropertyOption(option));
  };

  /**
   * Product option edit dialog close handler
   */
  const handleOptionEditDialogClose = () => {
    setOpenOptionAddEditDialog(false);
    dispatch(setCurrentPropertyOption(undefined));
  };

  /**
   * Product option delete button click handler
   * @param option selected option to delete
   */
  const handleOptionDeleteClick = (option: MPropertyOption) => {
    setOpenOptionDeleteDialog(true);
    dispatch(setCurrentPropertyOption(option));
  };

  /**
   * Product option delete dialog close handler
   */
  const handleOptionDeleteDialogClose = () => {
    setOpenOptionDeleteDialog(false);
    dispatch(setCurrentPropertyOption(undefined));
  };

  /**
   * Property delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentProperty(undefined));
    dispatch(setCurrentPropertyOption(undefined));
  };

  /**
   * Product Property section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by product property
   */
  const handleAddSubmit = async (formFields: IAddProperty) => {
    setAddLoading(true);
    try {
      await dispatch(addPropertyAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      toast.success(t('property_added_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT PROPERTY ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  };

  /**
   * Form submit handler
   * @param formFields form fields submitted by product property
   */
  const handleEditSubmit = async (formFields: IUpdateProperty) => {
    setEditLoading(true);
    try {
        await dispatch(updatePropertyAction(formFields)).then(unwrapResult);
        setOpenEditDialog(false);
        toast.success(t('property_modified_successfully'));
    } catch (error) {
      console.log('ADD/EDIT PRODUCT PROPERTY ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  };

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by propertyOption
   */
  const handleOptionAddEditSubmit = async (formFields: IAddUpdatePropertyOption) => {
    setOptionAddEditLoading(true);
    try {
      if (currentPropertyOption) {
        await dispatch(updatePropertyOptionAction(formFields)).then(unwrapResult);
        handleOptionEditDialogClose();
        toast.success(t('option_modified_successfully'));
      } else {
        await dispatch(addPropertyOptionAction(formFields)).then(unwrapResult);
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
   * PropertyOption delete event submit handler
   */
  const handleOptionDeleteSubmit = async () => {
    setOptionDeleteLoading(true);
    if (currentPropertyOption) {
      try {
        await dispatch(deletePropertyOptionAction()).then(unwrapResult);
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
   * Property delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentProperty) {
      try {
        await dispatch(deletePropertyAction()).then(unwrapResult);
        toast.success(t('property_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_property_selected'));
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
            canAdd={ability.can('create', 'property')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={properties} 
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
        <PropertyDetailDialog
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
        <PropertyAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <PropertyEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openOptionAddEditDialog &&
        <PropertyOptionAddEditDialog
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

Property.acl = {
  action: 'view',
  subject: 'property'
} as ACLObj;

export default Page(Property);
