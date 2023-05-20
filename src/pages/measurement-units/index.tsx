// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addMeasurementUnitAction, deleteMeasurementUnitAction, updateMeasurementUnitAction } from 'src/redux/actions/measurementUnit';
import { setCurrentMeasurementUnit } from "src/redux/reducers/measurementUnit";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateMeasurementUnit } from 'src/interfaces/product/addUpdateMeasurementUnit';
import { MMeasurementUnit } from "src/models/product/measurementUnit";

// ** MUI Imports
import { GridColDef, GridRowParams, DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { Card, Grid, Box, Tooltip } from '@mui/material';

// ** Icons Imports
import PencilOutlineIcon from 'mdi-material-ui/PencilOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';

// ** Third Party Imports
import { t } from "i18next";
import { toast } from 'react-toastify';
import { AbilityContext } from 'src/components/layout/acl/Can';
import { displayErrors, setDataGridLocale } from 'src/utils/common';

// ** Custom components Imports
import MeasurementUnitAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";

/**
 * MeasurementUnit section index page
 * @returns MeasurementUnit page component
 */
const MeasurementUnit = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { measurementUnitReducer: { measurementUnits, currentMeasurementUnit } } = useAppSelector((state) => state);
  // ** DataGrid Vars
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  // ** Dialog open flags
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
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'abbreviation',
      headerName: String(t('abbreviation'))
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('edit')}><PencilOutlineIcon /></Tooltip>} onClick={() => handleEditClick(row)} label={t('edit')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => handleDeleteClick(row)} label={t('delete')} />
      ]
    }
  ];

  /**
   * Dialog functions and handlers
   */

  /**
   * Edit button click handler
   */
  const handleEditClick = (measurementUnit: MMeasurementUnit) => {
    setOpenAddEditDialog(true);
    dispatch(setCurrentMeasurementUnit(measurementUnit));
  };
  
  /**
   * MeasurementUnit add edit dialog close handler
   */
  const handleAddEditDialogClose = () => {
    setOpenAddEditDialog(false);
    dispatch(setCurrentMeasurementUnit(undefined));
  };

  /**
   * Delete button click handler
   */
  const handleDeleteClick = (measurementUnit: MMeasurementUnit) => {
    setOpenDeleteDialog(true);
    dispatch(setCurrentMeasurementUnit(measurementUnit));
  };

  /**
   * MeasurementUnit delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    dispatch(setCurrentMeasurementUnit(undefined));
  };

  /**
   * Measurement unit section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by measurement unit
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateMeasurementUnit) => {
    setAddEditLoading(true);
    try {
      if (currentMeasurementUnit) {
        await dispatch(updateMeasurementUnitAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('measurement_unit_modified_successfully'));
      } else {
        await dispatch(addMeasurementUnitAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('measurement_unit_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT MEASUREMENT UNIT ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * MeasurementUnit delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentMeasurementUnit) {
      try {
        await dispatch(deleteMeasurementUnitAction()).then(unwrapResult);
        toast.success(t('measurement_unit_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_measurement_unit_selected'));
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
            canAdd={ability.can('create', 'measurement_unit')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={measurementUnits} 
              localeText={setDataGridLocale()}
              loading={tableLoading}
              filterModel={{
                items: [{ field: 'name', operator: 'contains', value: filterValue }]
              }}
              disableColumnMenu={true}
              hideFooterSelectedRowCount
              disableRowSelectionOnClick
            />
          </Box>
        </Card>
      </Grid>

      {openAddEditDialog &&
        <MeasurementUnitAddEditDialog
          open={openAddEditDialog}
          loading={addEditLoading}
          onSubmit={handleAddEditSubmit}
          onClose={handleAddEditDialogClose}
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

MeasurementUnit.acl = {
  action: 'view',
  subject: 'measurement_unit'
} as ACLObj;

export default Page(MeasurementUnit);
