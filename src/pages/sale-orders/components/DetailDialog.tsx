// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { MSaleOrderProduct } from 'src/models/sale-order/product';

// ** MUI Imports
import { GridColDef, GridValueGetterParams, GridValueFormatterParams, GridActionsCellItem, GridRowParams, DataGridPro } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, DialogTitle, Box, Typography, Grid, Tooltip, useMediaQuery, useTheme, Divider, lighten } from '@mui/material';
import { Button, IconButton } from '@mui/material';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';
import PlusIcon from 'mdi-material-ui/Plus';
import PencilIcon from 'mdi-material-ui/Pencil';
import PencilOutlineIcon from 'mdi-material-ui/PencilOutline';
import DeleteIcon from 'mdi-material-ui/Delete';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import CancelIcon from 'mdi-material-ui/Cancel';

// ** Third Party Imports
import { formatDate, formatMoney, formatNumber } from 'src/utils/format';
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';
import Chip from 'src/components/mui/chip';
import { makeStyles } from '@mui/styles';
import { hexToRGBA } from 'src/utils/hex-to-rgba';


/**
 * Component props
 */
interface IProps {
  open: boolean;
  onEditClick: () => void;
  onProductsAddClick: () => void;
  onProductsCancelClick: () => void;
  onProductEditClick: (product: MSaleOrderProduct) => void;
  onProductCancelClick: (product: MSaleOrderProduct) => void;
  onProductDeleteClick: (product: MSaleOrderProduct) => void;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onClose: () => void;
};

const StatusChip = (props: {statusId?: number}) => {
  switch (props.statusId) {
    case 1:
      return <Chip label={t('pending')} skin='light' color='warning' />;
    case 2:
      return <Chip label={t('processed_partially')} skin='light' color='warning' />;
    case 3:
      return <Chip label={t('processed')} skin='light' color='success' />;
    case 4:
      return <Chip label={t('canceled')} skin='light' color='error' />;
  }
  return <Chip label={t('pending')} skin='light' color='warning' />;
};

/**
 * SaleOrder edit dialog
 * @param props component parameters
 * @returns SaleOrder Edit Dialog component
 */
const SaleOrderDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onProductsAddClick, onProductsCancelClick, onProductEditClick, onProductCancelClick, onProductDeleteClick, onCancelClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { saleOrderReducer: { currentSaleOrder } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const billedClass = makeStyles({
    div: {
      backgroundColor: hexToRGBA(theme.palette.success.light, 0.4)
    }
  })();
  const canceledClass = makeStyles({
    div: {
      backgroundColor: hexToRGBA(theme.palette.error.light, 0.4)
    }
  })();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const subtotal = currentSaleOrder?.products.reduce((acumulator, product) => acumulator + product.price.amount * product.quantity, 0);
  const discount = currentSaleOrder?.products.reduce((acumulator, product) => acumulator + product.price.amount * product.quantity * product.discount, 0);

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
      field: 'billed_quantity',
      headerName: String(t('billed_quantity')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => `${formatNumber(row.billedQuantity)} ${row.measurementUnit.abbreviation}`
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'canceled_quantity',
      headerName: String(t('canceled_quantity')),
      align: 'right',
      valueGetter: ({ row }: GridValueGetterParams) => `${formatNumber(row.canceledQuantity)} ${row.measurementUnit.abbreviation}`
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
      minWidth: 150,
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('information')}><InformationOutlineIcon /></Tooltip>} onClick={() => {}} label={t('information')} />,
        <GridActionsCellItem icon={<Tooltip title={t('cancel')}><CancelIcon /></Tooltip>} onClick={() => onProductCancelClick(row)} label={t('cancel')} />,
        <GridActionsCellItem icon={<Tooltip title={t('edit')}><PencilOutlineIcon /></Tooltip>} onClick={() => onProductEditClick(row)} label={t('edit')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => onProductDeleteClick(row)} label={t('delete')} />
      ]
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
          {t('sale_order_data')}
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
              <Button sx={{ mr: 2 }} onClick={onEditClick} variant='outlined' color='primary' startIcon={<PencilIcon fontSize='small' />}>
                {t('edit')}
              </Button>
              <Button sx={{ mr: 2 }} onClick={onCancelClick} variant='outlined' color='error' startIcon={<CancelIcon fontSize='small' />}>
                {t('cancel')}
              </Button>
              <Button sx={{ mr: 2 }} onClick={onDeleteClick} variant='outlined' color='error' startIcon={<DeleteIcon fontSize='small' />}>
                {t('delete')}
              </Button>
            </Box>
            <Box sx={{ display: {xs: 'inline-flex', md: 'none'} }}>
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
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('identification_document')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.identificationDocument}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('phone')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('email')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('address')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.address}</Typography>
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
                <Typography variant='h6'>{t('sale_order_data')}</Typography>
                <Divider />
                <Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('status')}:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                      <StatusChip statusId={currentSaleOrder?.statusId} />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('expires_at')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{formatDate(currentSaleOrder?.expiresAt)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('establishment')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.establishment.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('point_of_sale')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.pointOfSale.number}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('warehouse')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.warehouse.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle1'>
                      {t('seller')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentSaleOrder?.seller.name}</Typography>
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
              <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                  <Button sx={{ mr: 2 }} onClick={onProductsAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                    {t('add')}
                  </Button>
                  <Button sx={{ mr: 2 }} onClick={onProductsCancelClick} variant='outlined' color='error' startIcon={<CancelIcon fontSize='small' />}>
                    {t('cancel')}
                  </Button>
                </Box>
                <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                  <Button sx={{ mr: 2 }} onClick={onProductsAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                  <Button sx={{ mr: 2 }} onClick={onProductsCancelClick} color='error' variant='outlined'><CancelIcon fontSize='small'/></Button>
                </Box>
              </Box>
              <DataGridPro
                autoHeight
                columns={productColumns} 
                rows={currentSaleOrder?.products ?? []} 
                localeText={setDataGridLocale()}
                disableColumnMenu={true}
                hideFooterRowCount
                hideFooter
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                getRowClassName={({ row }) => row.quantity === row.canceledQuantity ? canceledClass.div : row.quantity === row.billedQuantity ? billedClass.div : ''}
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
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(subtotal, currentSaleOrder?.currency)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('discount')}:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(discount, currentSaleOrder?.currency)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{t('total')}:</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(currentSaleOrder?.amount, currentSaleOrder?.currency)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaleOrderDetailDialog;
