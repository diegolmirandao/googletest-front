// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateSaleOrder } from 'src/interfaces/sale-order/update';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { useEffect } from 'react';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateSaleOrder) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const SaleOrderEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleOrderReducer: { currentSaleOrder }, customerReducer: { customers }, currencyReducer: { currencies }, userReducer: { users }, establishmentReducer: { establishments }, warehouseReducer: { warehouses } } = useAppSelector((state) => state);
  // ** Vars
  const pointsOrSale = establishments.map(establishment => establishment.pointsOfSale).flat();

  const defaultValues: IUpdateSaleOrder = {
    customer_id: currentSaleOrder?.customerId ?? 1,
    currency_id: currentSaleOrder?.currencyId ?? 1,
    establishment_id: currentSaleOrder?.establishment.id ?? 1,
    point_of_sale_id: currentSaleOrder?.pointOfSaleId ?? 1,
    warehouse_id: currentSaleOrder?.warehouseId ?? 1,
    seller_id: currentSaleOrder?.sellerId ?? 1,
    ordered_at: dayjs(currentSaleOrder?.orderedAt) ?? dayjs(),
    expires_at: currentSaleOrder?.expiresAt ? dayjs(currentSaleOrder?.expiresAt) : null,
    comments: currentSaleOrder?.comments ?? '',
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IUpdateSaleOrder>({
    defaultValues,
    mode: 'onChange'
  });

  let watchEstablishment = watch('establishment_id');

  useEffect(() => {
    const newDefaultPointOfSale = establishments.find(establishment => establishment.id === watchEstablishment && establishment.id === defaultValues.establishment_id) ?? establishments.find(establishment => establishment.id === watchEstablishment);
    setValue('point_of_sale_id', newDefaultPointOfSale!.id);
  }, [watchEstablishment]);

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
    reset();
    onClose();
  };

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {t('edit_sale_order')}
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='ordered_at'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t('date')}
                  value={value}
                  format='DD-MM-YYYY'
                  onChange={onChange}
                  slotProps={{ textField: {  } }}
                />
              )}
            />
            {errors.ordered_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.ordered_at.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='customer_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  blurOnSelect
                  options={customers}
                  getOptionLabel={option => `${option.identificationDocument} - ${option.name}`}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={customers.find(customer => customer.id == value)!}
                  renderInput={params => <TextField {...params} label={t('customer')} />}
                />
              )}
            />
            {errors.customer_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.customer_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='currency_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={currencies}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={currencies.find(currency => currency.id == value)!}
                  renderInput={params => <TextField {...params} label={t('currency')} />}
                />
              )}
            />
            {errors.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.currency_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='seller_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={users}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={users.find(user => user.id == value)!}
                  renderInput={params => <TextField {...params} label={t('seller')} />}
                />
              )}
            />
            {errors.seller_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.seller_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='establishment_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={establishments}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={establishments.find(establishment => establishment.id == value)!}
                  renderInput={params => <TextField {...params} label={t('establishment')} />}
                />
              )}
            />
            {errors.establishment_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.establishment_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='point_of_sale_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={pointsOrSale.filter(pointsOrSale => pointsOrSale.establishmentId == watchEstablishment)}
                  getOptionLabel={option => String(option.number)}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={pointsOrSale.find(pointOfSaleOrder => pointOfSaleOrder.id == value)}
                  renderInput={params => <TextField {...params} label={t('point_of_sale')} />}
                />
              )}
            />
            {errors.point_of_sale_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.point_of_sale_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='warehouse_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={warehouses}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={warehouses.find(warehouse => warehouse.id == value)!}
                  renderInput={params => <TextField {...params} label={t('warehouse')} />}
                />
              )}
            />
            {errors.warehouse_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.warehouse_id.message}`)}</FormHelperText>}
          </FormControl>
                  
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='expires_at'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label={t('expires_at')}
                  value={value}
                  format='DD-MM-YYYY'
                  onChange={onChange}
                  slotProps={{ textField: {  } }}
                />
              )}
            />
            {errors.expires_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.expires_at.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name='comments'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                multiline
                rows={3}
                label={t('comments')}
                onChange={onChange}
                error={Boolean(errors.comments)}
              />
              )}
            />
            {errors.comments && <FormHelperText sx={{ color: 'error.main' }}>{errors.comments.message}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} loading={loading}>
            {t('save')}
          </LoadingButton>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaleOrderEditDialog;
