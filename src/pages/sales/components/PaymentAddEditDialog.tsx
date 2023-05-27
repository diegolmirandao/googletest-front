// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateSalePayment } from 'src/interfaces/sale/addUpdatePayment';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddUpdateSalePayment) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const SalePaymentAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleReducer: { currentSalePayment }, currencyReducer: { currencies }, paymentMethodReducer: { paymentMethods } } = useAppSelector((state) => state);
  // ** Vars
  const defaultValues: IAddUpdateSalePayment = {
    currency_id: currentSalePayment?.currencyId ?? 1,
    payment_method_id: currentSalePayment?.paymentMethodId ?? 1,
    paid_at: dayjs(currentSalePayment?.paidAt) ?? dayjs(),
    amount: currentSalePayment?.amount ?? 0,
    comments: currentSalePayment?.comments ?? ''
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
  } = useForm<IAddUpdateSalePayment>({
    defaultValues,
    mode: 'onChange'
  });

  let watchCurrency = watch('currency_id');

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
      maxWidth='md'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {currentSalePayment ? t('edit_payment') : t('add_payment')}
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
        <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='paid_at'
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
            {errors.paid_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.paid_at.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
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
                  renderInput={params => <TextField {...params} label='Moneda' />}
                />
              )}
            />
            {errors.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.currency_id.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='payment_method_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={paymentMethods}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => {onChange(newValue.id)}}
                  value={paymentMethods.find(paymentMethod => paymentMethod.id == value)!}
                  renderInput={params => <TextField {...params} label='Método de pago' />}
                />
              )}
            />
            {errors.payment_method_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.payment_method_id.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='amount'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                type='number'
                value={value}
                label='Monto'
                onChange={onChange}
                error={Boolean(errors.amount)}
                inputProps={{
                  sx: { textAlign: 'right'}
                }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == watchCurrency)?.abbreviation}</InputAdornment>
                }}
              />
              )}
            />
            {errors.amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.amount.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='comments'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                multiline
                rows={3}
                label='Comentarios'
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

export default SalePaymentAddEditDialog;
