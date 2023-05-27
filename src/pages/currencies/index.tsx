// ** React Imports
import { useContext, useState } from "react";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// ** Actions and Reducers Imports
import { addCurrencyAction, deleteCurrencyAction, updateCurrencyAction } from 'src/redux/actions/currency';
import { setCurrentCurrency } from "src/redux/reducers/currency";

// ** Interfaces and Types Imports
import { ACLObj } from "src/config/acl";
import { IAddUpdateCurrency } from 'src/interfaces/currency/addUpdate';
import { MCurrency } from "src/models/currency";

// ** MUI Imports
import { GridColDef, GridRowParams, DataGridPro, GridActionsCellItem, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid-pro';
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
import CurrencyAddEditDialog from './components/AddEditDialog';
import DeleteDialog from 'src/components/DeleteDialog';
import TableHeaderAlt from "src/components/table/TableHeaderAlt";
import Page from "src/components/Page";
import { formatNumber } from "src/utils/format";
import Chip from "src/components/mui/chip";

/**
 * Currency section index page
 * @returns Currency page component
 */
const Currency = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);
  // ** Reducers
  const { currencyReducer: { currencies, currentCurrency } } = useAppSelector((state) => state);
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
      flex: 0.15,
      minWidth: 200,
      field: 'code',
      headerName: 'Código'
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'abbreviation',
      headerName: 'Abreviación'
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'exchangeRate',
      headerName: 'Cotización',
      valueFormatter: ({ value }: GridValueFormatterParams<string>) => formatNumber(value),
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'main',
      headerName: 'Principal',
      renderCell: (params: GridRenderCellParams) => (
        params.row.main ? <Chip label={t('yes')} skin='light' color='success' /> : <Chip label={t('no')} skin='light' color='error' />
      )
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
  const handleEditClick = (currency: MCurrency) => {
    setOpenAddEditDialog(true);
    dispatch(setCurrentCurrency(currency));
  };
  
  /**
   * Currency add edit dialog close handler
   */
  const handleAddEditDialogClose = () => {
    setOpenAddEditDialog(false);
    dispatch(setCurrentCurrency(undefined));
  };

  /**
   * Delete button click handler
   */
  const handleDeleteClick = (currency: MCurrency) => {
    setOpenDeleteDialog(true);
    dispatch(setCurrentCurrency(currency));
  };

  /**
   * Currency delete dialog close handler
   */
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    dispatch(setCurrentCurrency(undefined));
  };

  /**
   * Currency section handlers
   */

  /**
   * Form submit handler
   * @param formFields form fields submitted by currency
   */
  const handleAddEditSubmit = async (formFields: IAddUpdateCurrency) => {
    setAddEditLoading(true);
    try {
      if (currentCurrency) {
        await dispatch(updateCurrencyAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('currency_modified_successfully'));
      } else {
        await dispatch(addCurrencyAction(formFields)).then(unwrapResult);
        handleAddEditDialogClose();
        toast.success(t('currency_added_successfully'));
      }
    } catch (error) {
      console.log('ADD/EDIT CURRENCY ERROR: ', error);
      displayErrors(error);
    }
    setAddEditLoading(false);
  }

  /**
   * Currency delete event submit handler
   */
  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    if (currentCurrency) {
      try {
        await dispatch(deleteCurrencyAction()).then(unwrapResult);
        toast.success(t('currency_deleted_successfully'));
        handleDeleteDialogClose();
      } catch (error) {
        displayErrors(error);
      }
    } else {
      toast.error(t('no_currency_selected'));
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
            canAdd={ability.can('create', 'currency')}
          />
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGridPro
              columns={columns} 
              rows={currencies} 
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
        <CurrencyAddEditDialog
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

Currency.acl = {
  action: 'view',
  subject: 'currency'
} as ACLObj;

export default Page(Currency);
