// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addAcquisitionChannelAction, deleteAcquisitionChannelAction, updateAcquisitionChannelAction } from 'src/redux/actions/acquisitionChannel';
import { setCurrentAcquisitionChannel } from "src/redux/reducers/acquisitionChannel";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateAcquisitionChannel } from 'src/interfaces/customer/addUpdateAcquisitionChannel';
import { MAcquisitionChannel } from "src/models/customer/acquisitionChannel";

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
import AcquisitionChannelAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";

/**
 * AcquisitionChannel section index page
 * @returns AcquisitionChannel page component
 */
const AcquisitionChannel = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { acquisitionChannelReducer: { acquisitionChannels, currentAcquisitionChannel } } = useAppSelector((state) => state);
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
  const handleEditClick = (acquisitionChannel: MAcquisitionChannel) => {
    setOpenAddEditDialog(true);
    dispatch(setCurrentAcquisitionChannel(acquisitionChannel));
  };
  
  /**
   * AcquisitionChannel add edit dialog close handler
   */
  const handleAddEditDialogClose = () => {
    setOpenAddEditDialog(false);
    dispatch(setCurrentAcquisitionChannel(undefined));
  };

  /**
   * Delete button click handler
   */
  const handleDeleteClick = (acquisitionChannel: MAcquisitionChannel) => {
    setOpenDeleteDialog(true);
    dispatch(setCurrentAcquisitionChannel(acquisitionChannel));
  };

  /**
   * AcquisitionChannel delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    dispatch(setCurrentAcquisitionChannel(undefined));
  };

  /**
   * Acquisition channel section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by acquisition channel
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateAcquisitionChannel) => {
    setAddEditLoading(true);
    try {
      if (currentAcquisitionChannel) {
        await dispatch(updateAcquisitionChannelAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('channel_modified_successfully'));
      } else {
        await dispatch(addAcquisitionChannelAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('channel_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT ACQUISITION CHANNEL ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * AcquisitionChannel delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentAcquisitionChannel) {
      try {
        await dispatch(deleteAcquisitionChannelAction()).then(unwrapResult);
        toast.success(t('channel_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_channel_selected'));
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
            canAdd={ability.can('create', 'acquisition_channel')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={acquisitionChannels} 
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
        <AcquisitionChannelAddEditDialog
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

AcquisitionChannel.acl = {
  action: 'view',
  subject: 'acquisition_channel'
} as ACLObj;

export default Page(AcquisitionChannel);
