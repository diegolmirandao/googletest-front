// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addEstablishmentAction, deleteEstablishmentAction, updateEstablishmentAction } from 'src/redux/actions/establishment';
import { addPointOfSaleAction, updatePointOfSaleAction, deletePointOfSaleAction } from "src/redux/actions/establishment";
import { setCurrentEstablishment, setCurrentPointOfSale  } from "src/redux/reducers/establishment";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddEstablishment } from 'src/interfaces/establishment/add';
import { IUpdateEstablishment } from 'src/interfaces/establishment/update';
import { MEstablishment } from "src/models/establishment";
import { MPointOfSale } from "src/models/pointOfSale";
import { IAddUpdatePointOfSale } from "src/interfaces/establishment/addUpdatePointOfSale";

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
import EstablishmentAddDialog from "./components/AddDialog";
import EstablishmentDetailDialog from "./components/DetailDialog";
import EstablishmentEditDialog from "./components/EditDialog";
import PointOfSaleAddEditDialog from "./components/PointOfSaleAddEditDialog";

/**
 * Establishment section index page
 * @returns Establishment page component
 */
const Establishment = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { establishmentReducer: { establishments, currentEstablishment, currentPointOfSale } } = useAppSelector((state) => state);
  // ** DataGrid Vars
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  // ** Dialog open flags
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openPointOfSaleAddEditDialog, setOpenPointOfSaleAddEditDialog] = useState<boolean>(false);
  const [openPointOfSaleDeleteDialog, setOpenPointOfSaleDeleteDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  // ** Loading flags
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [pointOfSaleAddEditLoading, setPointOfSaleAddEditLoading] = useState<boolean>(false);
  const [pointOfSaleDeleteLoading, setPointOfSaleDeleteLoading] = useState<boolean>(false);
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
    dispatch(setCurrentEstablishment(row.row));
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
    dispatch(setCurrentEstablishment(undefined));
    dispatch(setCurrentPointOfSale(undefined));
  };

  /**
   * Establishment pointOfSale edit button click handler
   * @param pointOfSale selected pointOfSale to edit
   */
  const handlePointOfSaleEditClick = (pointOfSale: MPointOfSale) => {
    setOpenPointOfSaleAddEditDialog(true);
    dispatch(setCurrentPointOfSale(pointOfSale));
  };

  /**
   * Establishment pointOfSale edit dialog close handler
   */
  const handlePointOfSaleEditDialogClose = () => {
    setOpenPointOfSaleAddEditDialog(false);
    dispatch(setCurrentPointOfSale(undefined));
  };

  /**
   * Establishment pointOfSale delete button click handler
   * @param pointOfSale selected pointOfSale to delete
   */
  const handlePointOfSaleDeleteClick = (pointOfSale: MPointOfSale) => {
    setOpenPointOfSaleDeleteDialog(true);
    dispatch(setCurrentPointOfSale(pointOfSale));
  };

  /**
   * Establishment pointOfSale delete dialog close handler
   */
  const handlePointOfSaleDeleteDialogClose = () => {
    setOpenPointOfSaleDeleteDialog(false);
    dispatch(setCurrentPointOfSale(undefined));
  };

  /**
   * Establishment delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setOpenDetailDialog(false);
    dispatch(setCurrentEstablishment(undefined));
    dispatch(setCurrentPointOfSale(undefined));
  };

  /**
   * Establishment section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by establishment
   */
  const handleAddSubmit = async (formFields: IAddEstablishment) => {
    setAddLoading(true);
    try {
      await dispatch(addEstablishmentAction(formFields)).then(unwrapResult);
      setOpenAddDialog(false);
      toast.success(t('establishment_added_successfully'));
    } catch (error) {
      console.log('ADD/EDIT ESTABLISHMENT ERROR: ', error);
      displayErrors(error);
    }
    setAddLoading(false);
  };

  /**
   * Form submit handler
   * @param formFields form fields submitted by establishment
   */
  const handleEditSubmit = async (formFields: IUpdateEstablishment) => {
    setEditLoading(true);
    try {
        await dispatch(updateEstablishmentAction(formFields)).then(unwrapResult);
        setOpenEditDialog(false);
        toast.success(t('establishment_modified_successfully'));
    } catch (error) {
      console.log('ADD/EDIT ESTABLISHMENT ERROR: ', error);
      displayErrors(error);
    }
    setEditLoading(false);
  };

  /**
   * Form edit submit handler
   * @param formFields form fields submitted by pointOfSale
   */
  const handlePointOfSaleAddEditSubmit = async (formFields: IAddUpdatePointOfSale) => {
    setPointOfSaleAddEditLoading(true);
    try {
      if (currentPointOfSale) {
        await dispatch(updatePointOfSaleAction(formFields)).then(unwrapResult);
        handlePointOfSaleEditDialogClose();
        toast.success(t('point_of_sale_modified_successfully'));
      } else {
        await dispatch(addPointOfSaleAction(formFields)).then(unwrapResult);
        setOpenPointOfSaleAddEditDialog(false);
        toast.success(t('point_of_sale_added_successfully'));
      }
    } catch (error) {
      console.error('ADD/EDIT ESTABLISHMENT POINTOFSALE ERROR: ', error);
      displayErrors(error);
    }
    setPointOfSaleAddEditLoading(false);
  }

  /**
   * PointOfSale delete event submit handler
   */
  const handlePointOfSaleDeleteSubmit = async () => {
    setPointOfSaleDeleteLoading(true);
    if (currentPointOfSale) {
      try {
        await dispatch(deletePointOfSaleAction()).then(unwrapResult);
        toast.success(t('point_of_sale_deleted_successfully'));
        handlePointOfSaleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_point_of_sale_selected'));
    }
    setPointOfSaleDeleteLoading(false);
  };

  /**
   * Establishment delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentEstablishment) {
      try {
        await dispatch(deleteEstablishmentAction()).then(unwrapResult);
        toast.success(t('establishment_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_establishment_selected'));
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
            canAdd={ability.can('create', 'establishment')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={establishments} 
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
        <EstablishmentDetailDialog
          open={openDetailDialog}
          onEditClick={() => setOpenEditDialog(true)}
          onPointOfSaleAddClick={() => setOpenPointOfSaleAddEditDialog(true)}
          onPointOfSaleEditClick={handlePointOfSaleEditClick}
          onPointOfSaleDeleteClick={handlePointOfSaleDeleteClick}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onClose={handleDetailDialogClose}
        />
      }
      {openAddDialog &&
        <EstablishmentAddDialog
          open={openAddDialog}
          loading={addLoading}
          onSubmit={handleAddSubmit}
          onClose={() => setOpenAddDialog(false)}
        />
      }
      {openEditDialog &&
        <EstablishmentEditDialog
          open={openEditDialog}
          loading={editLoading}
          onSubmit={handleEditSubmit}
          onClose={() => setOpenEditDialog(false)}
        />
      }
      {openPointOfSaleAddEditDialog &&
        <PointOfSaleAddEditDialog
          open={openPointOfSaleAddEditDialog}
          loading={pointOfSaleAddEditLoading}
          onSubmit={handlePointOfSaleAddEditSubmit}
          onClose={handlePointOfSaleEditDialogClose}
        />
      }
      {openPointOfSaleDeleteDialog &&
        <DeleteDialog
          open={openPointOfSaleDeleteDialog}
          loading={pointOfSaleDeleteLoading}
          onConfirm={handlePointOfSaleDeleteSubmit}
          onClose={handlePointOfSaleDeleteDialogClose}
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

Establishment.acl = {
  action: 'view',
  subject: 'establishment'
} as ACLObj;

export default Page(Establishment);
