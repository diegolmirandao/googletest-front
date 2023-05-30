// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { MSalePayment } from 'src/models/sale/payment';

// ** MUI Imports
import { GridColDef, GridValueGetterParams, GridValueFormatterParams, GridActionsCellItem, GridRowParams, DataGridPro } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, DialogActions, FormControl, DialogTitle, Box, Typography, styled, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme, Divider } from '@mui/material';
import { Button, IconButton } from '@mui/material';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import PencilOutlineIcon from 'mdi-material-ui/PencilOutline';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import CashMultipleIcon from 'mdi-material-ui/CashMultiple';
import PlusIcon from 'mdi-material-ui/Plus';
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import { formatDate, formatMoney, formatNumber } from 'src/utils/format';
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';

// ** Third Party Imports

/**
 * Component props
 */
interface IProps {
  open: boolean;
  onEditClick: () => void;
  onPaymentAddClick: () => void;
  onPaymentEditClick: (payment: MSalePayment) => void;
  onPaymentDeleteClick: (payment: MSalePayment) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Sale edit dialog
 * @param props component parameters
 * @returns Sale Edit Dialog component
 */
const SaleDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onPaymentAddClick, onPaymentEditClick, onPaymentDeleteClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { saleReducer: { currentSale } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const subtotal = currentSale?.products.reduce((acumulator, product) => acumulator + product.price.amount * product.quantity, 0);
  const discount = currentSale?.products.reduce((acumulator, product) => acumulator + product.price.amount * product.quantity * product.discount, 0);

  /**
   * DataGrid Columns definition products
   */
  const productColumns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 130,
      field: 'code',
      headerName: String(t('code'))
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'name',
      headerName: String(t('name'))
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'price',
      headerName: String(t('price')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => formatMoney(row.price.amount, row.price.currency)
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'quantity',
      headerName: String(t('quantity')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => `${formatNumber(row.quantity)} ${row.measurementUnit.abbreviation}`
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'discount',
      headerName: String(t('discount')),
      align: 'right',
      valueFormatter: ({ value }: GridValueFormatterParams) => `${formatNumber(value * 100)} %`
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'total',
      headerName: String(t('total')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => formatMoney((row.price.amount * row.quantity - row.price.amount * row.quantity * row.discount), row.price.currency)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('information')}><InformationOutlineIcon /></Tooltip>} onClick={() => {}} label={t('information')} />
      ]
    }
  ];

  /**
   * DataGrid Columns definition payments
   */
  const paymentColumns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'paidAt',
      headerName: String(t('date')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'paymentMethod',
      headerName: String(t('method')),
      valueGetter: ({ row }: GridValueGetterParams) => row.method.name
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'amount',
      headerName: String(t('amount')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => formatMoney(row.amount, row.currency)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('information')}><InformationOutlineIcon /></Tooltip>} onClick={() => {}} label={t('information')} />,
        <GridActionsCellItem icon={<Tooltip title={t('edit')}><PencilOutlineIcon /></Tooltip>} onClick={() => onPaymentEditClick(params.row)} label={t('edit')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => onPaymentDeleteClick(params.row)} label={t('delete')} />
      ]
    }
  ];

  /**
   * DataGrid Columns definition intalments
   */
  const instalmentColumns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 200,
      field: 'number',
      headerName: String(t('number')),
      valueFormatter: ({ value }: GridValueFormatterParams) => !!value ? value : t('down_payment')
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'expiresAt',
      headerName: String(t('expiration')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatDate(value)
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'amount',
      headerName: String(t('amount')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => formatMoney(row.amount, currentSale?.currency)
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'balance',
      headerName: String(t('balance')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => {
        const paidAmount = currentSale?.paidAmount;
        const previousInstalmentsAmount = currentSale?.instalments.filter(instalment => instalment.number < row.number).reduce((sum, current) => sum + Number(current.amount), 0);
        const calculatedBalance = row.amount - ((paidAmount ?? 0) - (previousInstalmentsAmount ?? 0));
        const balance = calculatedBalance > 0 ? (calculatedBalance < row.amount ? calculatedBalance : row.amount) : 0;
        return formatMoney(balance, currentSale?.currency);
      }
    }
  ];

  /**
   * Dialog handlers
   */

  /**
   * Handler when the dialog requests to be closed
   * @param event The event source of the callback
   * @param reason Can be: "escapeKeyDown", "backdropClick"
   */
  const handleDialogClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    handleClose();
  };

  /**
   * Close form handler
   */
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        fullScreen={fullScreen}
        open={open}
        maxWidth='xl'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('sale_data')}
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/*
            START ACTION BUTTONS
          */}
          <Box sx={{ display: 'flex', justifyContent: 'right', mb: 6 }}>
            <Box sx={{ display: {xs: 'none', md: 'inline-flex'}}}>
              {!currentSale?.paidAt &&
                <Button sx={{ mr: 2 }} onClick={onPaymentAddClick} variant='outlined' color='primary' startIcon={<CashMultipleIcon fontSize='small' />}>
                  {t('generate_payment')}
                </Button>
              }
              <Button sx={{ mr: 2 }} onClick={onEditClick} variant='outlined' color='primary' startIcon={<PencilIcon fontSize='small' />}>
                {t('edit')}
              </Button>
              <Button sx={{ mr: 2 }} onClick={onDeleteClick} variant='outlined' color='error' startIcon={<DeleteIcon fontSize='small' />}>
                {t('delete')}
              </Button>
            </Box>
            <Box sx={{ display: {xs: 'inline-flex', md: 'none'} }}>
              {!currentSale?.paidAt &&
                <Button sx={{ mr: 2 }} onClick={onPaymentAddClick} color='primary' variant='outlined'><CashMultipleIcon fontSize='small'/></Button>
              }
              <Button sx={{ mr: 2 }} onClick={onEditClick} color='primary' variant='outlined'><PencilIcon fontSize='small'/></Button>
              <Button sx={{ mr: 2 }} onClick={onDeleteClick} color='error' variant='outlined'><DeleteIcon fontSize='small'/></Button>
            </Box>
          </Box>
          {/*
            END ACTION BUTTONS
          */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/*
                START CUSTOMER DETAILS
              */}
              <Box>
                <Typography variant='h6'>{t('customer_data')}</Typography>
                <Divider />
                <Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('name')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('identification_document')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.identificationDocument}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('phone')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('email')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('address')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.address}</Typography>
                  </Box>
                </Box>
              </Box>
              {/*
                END CUSTOMER DETAILS
              */}
            </Grid>
            <Grid item xs={12} md={6}>
              {/*
                START SALE DETAILS
              */}
              <Box>
                <Typography variant='h6'>{t('sale_data')}</Typography>
                <Divider />
                <Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('establishment')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.establishment.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('point_of_sale')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.pointOfSale.number}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('warehouse')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.warehouse.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('payment_term')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.paymentTerm.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('seller')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSale?.seller.name}</Typography>
                  </Box>
                </Box>
              </Box>
              {/*
                END SALE DETAILS
              */}
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {/*
                START PRODUCTS
              */}
              <Typography variant='h5'>{t('products')}</Typography>
              <DataGridPro
                autoHeight
                columns={productColumns} 
                rows={currentSale?.products ?? []} 
                localeText={setDataGridLocale()}
                disableColumnMenu={true}
                hideFooterRowCount
                hideFooter
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
              />
              {/*
                END PRODUCTS
              */}
            </Grid>
            <Grid item xs={12} sx={{padding: 0}}>
              <Grid container>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}>
                  <Grid container sx={{ pr: 12 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('subtotal')}:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(subtotal, currentSale?.currency)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('discount')}:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(discount, currentSale?.currency)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{t('total')}:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(currentSale?.amount, currentSale?.currency)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              {/*
                START PAYMENTS
              */}
              <Typography variant='h6'>{t('payments')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                    <Button sx={{ mr: 2 }} onClick={onPaymentAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                      {t('add')}
                    </Button>
                </Box>
                <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                    <Button sx={{ mr: 2 }} onClick={onPaymentAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                </Box>
              </Box>
              <DataGridPro
                autoHeight
                columns={paymentColumns} 
                rows={currentSale?.payments ?? []} 
                localeText={setDataGridLocale()}
                disableColumnMenu={true}
                hideFooterRowCount
                hideFooter
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
              />
              {/*
                END PAYMENTS
              */}
            </Grid>
            <Grid item xs={12} md={6}>
              {/*
                START INSTALMENTS
              */}
              {!!currentSale?.instalments.length &&
                <>
                  <Typography variant='h6'>{t('instalments')}</Typography>
                  <DataGridPro
                    autoHeight
                    columns={instalmentColumns} 
                    rows={currentSale?.instalments ?? []} 
                    localeText={setDataGridLocale()}
                    disableColumnMenu={true}
                    hideFooterRowCount
                    hideFooter
                    hideFooterSelectedRowCount
                    disableRowSelectionOnClick
                  />
                </>
              }
              {/*
                END INSTALMENTS
              */}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaleDetailDialog;
