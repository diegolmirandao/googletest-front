// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addWarehouseAction, deleteWarehouseAction, updateWarehouseAction } from 'src/redux/actions/warehouse';
import { setCurrentWarehouse } from "src/redux/reducers/warehouse";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateWarehouse } from 'src/interfaces/warehouse/addUpdate';
import { MWarehouse } from "src/models/warehouse";

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
import WarehouseAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";

/**
 * Warehouse section index page
 * @returns Warehouse page component
 */
const Warehouse = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { warehouseReducer: { warehouses, currentWarehouse } } = useAppSelector((state) => state);
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
  const handleEditClick = (warehouse: MWarehouse) => {
    setOpenAddEditDialog(true);
    dispatch(setCurrentWarehouse(warehouse));
  };
  
  /**
   * Warehouse add edit dialog close handler
   */
  const handleAddEditDialogClose = () => {
    setOpenAddEditDialog(false);
    dispatch(setCurrentWarehouse(undefined));
  };

  /**
   * Delete button click handler
   */
  const handleDeleteClick = (warehouse: MWarehouse) => {
    setOpenDeleteDialog(true);
    dispatch(setCurrentWarehouse(warehouse));
  };

  /**
   * Warehouse delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    dispatch(setCurrentWarehouse(undefined));
  };

  /**
   * Warehouse section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by warehouse
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateWarehouse) => {
    setAddEditLoading(true);
    try {
      if (currentWarehouse) {
        await dispatch(updateWarehouseAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('warehouse_modified_successfully'));
      } else {
        await dispatch(addWarehouseAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('warehouse_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT WAREHOUSE ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * Warehouse delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentWarehouse) {
      try {
        await dispatch(deleteWarehouseAction()).then(unwrapResult);
        toast.success(t('warehouse_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_warehouse_selected'));
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
            canAdd={ability.can('create', 'warehouse')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={warehouses} 
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
        <WarehouseAddEditDialog
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

Warehouse.acl = {
  action: 'view',
  subject: 'warehouse'
} as ACLObj;

export default Page(Warehouse);
