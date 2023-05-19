// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addCustomerReferenceTypeAction, deleteCustomerReferenceTypeAction, updateCustomerReferenceTypeAction } from 'src/redux/actions/customerReferenceType';
import { setCurrentCustomerReferenceType } from "src/redux/reducers/customerReferenceType";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateCustomerReferenceType } from 'src/interfaces/customer/addUpdateReferenceType';
import { MCustomerReferenceType } from "src/models/customer/referenceType";

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
import CustomerReferenceTypeAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";

/**
 * CustomerReferenceType section index page
 * @returns CustomerReferenceType page component
 */
const CustomerReferenceType = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { customerReferenceTypeReducer: { customerReferenceTypes, currentCustomerReferenceType } } = useAppSelector((state) => state);
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
  const handleEditClick = (customerReferenceType: MCustomerReferenceType) => {
    setOpenAddEditDialog(true);
    dispatch(setCurrentCustomerReferenceType(customerReferenceType));
  };
  
  /**
   * CustomerReferenceType add edit dialog close handler
   */
  const handleAddEditDialogClose = () => {
    setOpenAddEditDialog(false);
    dispatch(setCurrentCustomerReferenceType(undefined));
  };

  /**
   * Delete button click handler
   */
  const handleDeleteClick = (customerReferenceType: MCustomerReferenceType) => {
    setOpenDeleteDialog(true);
    dispatch(setCurrentCustomerReferenceType(customerReferenceType));
  };

  /**
   * CustomerReferenceType delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    dispatch(setCurrentCustomerReferenceType(undefined));
  };

  /**
   * Customer reference_types section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by customer reference_type
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateCustomerReferenceType) => {
    setAddEditLoading(true);
    try {
      if (currentCustomerReferenceType) {
        await dispatch(updateCustomerReferenceTypeAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('reference_type_modified_successfully'));
      } else {
        await dispatch(addCustomerReferenceTypeAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('reference_type_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT CUSTOMER REFERENCE TYPE ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * CustomerReferenceType delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentCustomerReferenceType) {
      try {
        await dispatch(deleteCustomerReferenceTypeAction()).then(unwrapResult);
        toast.success(t('reference_type_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_reference_type_selected'));
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
            canAdd={ability.can('create', 'customer_reference_type')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={customerReferenceTypes} 
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
        <CustomerReferenceTypeAddEditDialog
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

CustomerReferenceType.acl = {
  action: 'view',
  subject: 'customer_reference_type'
} as ACLObj;

export default Page(CustomerReferenceType);
