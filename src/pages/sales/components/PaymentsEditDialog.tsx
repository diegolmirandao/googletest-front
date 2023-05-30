// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateSalePayment } from 'src/interfaces/sale/addUpdatePayment';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete, Grid, Divider, Tooltip, Box } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import PlusIcon from 'mdi-material-ui/Plus';

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { t } from 'i18next';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuid } from 'uuid';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  selectedPayments?: IAddUpdateSalePayment[];
  onSubmit: (formFields: IAddUpdateSalePayment[]) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const SalePaymentsEditDialog = (props: IProps) => {
  // ** Props
  const { open, selectedPayments, onSubmit, onClose } = props;
  // ** Reducers
  const { saleReducer: { currentSalePayment }, currencyReducer: { currencies }, paymentMethodReducer: { paymentMethods } } = useAppSelector((state) => state);
  // ** Vars
  const defaultPayment = {
    id: null,
    currency_id: 1,
    payment_method_id: 1,
    paid_at: dayjs(),
    amount: 0,
    comments: ''
  };
  const defaultValues: {payments: IAddUpdateSalePayment[]} = {
      payments: selectedPayments?.length? selectedPayments : [defaultPayment]
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const {
    fields: paymentFields,
    append: paymentAppend,
    remove: paymentRemove
  } = useFieldArray({
    control,
    name: "payments",
    keyName: "key"
  });

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
        {currentSalePayment ? t('edit_payments') : t('add_payments')}
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit((data) => onSubmit(data.payments))}>
        <DialogContent>
          {paymentFields.map((payment, index) => (
            <Box key={payment.key}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                      <FormControl fullWidth>
                        <Controller
                          name={`payments.${index}.paid_at`}
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
                        {errors.payments?.[index]?.paid_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.payments?.[index]?.paid_at?.message}`)}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth>
                        <Controller
                          name={`payments.${index}.payment_method_id`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              openOnFocus
                              disableClearable
                              options={paymentMethods}
                              getOptionLabel={option => option.name}
                              onChange={(event, newValue) => {onChange(newValue.id)}}
                              value={paymentMethods.find(paymentMethod => paymentMethod.id == value)!}
                              renderInput={params => <TextField {...params} label={t('payment_method')} />}
                            />
                          )}
                        />
                        {errors.payments?.[index]?.payment_method_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.payments?.[index]?.payment_method_id?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <Controller
                          name={`payments.${index}.currency_id`}
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
                        {errors.payments?.[index]?.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.payments?.[index]?.currency_id?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <FormControl fullWidth>
                        <Controller
                          name={`payments.${index}.amount`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            type='number'
                            value={value}
                            label={t('amount')}
                            onChange={onChange}
                            error={Boolean(errors.payments?.[index]?.amount)}
                            inputProps={{
                              sx: { textAlign: 'right'}
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues(`payments.${index}.currency_id`))?.abbreviation}</InputAdornment>
                            }}
                          />
                          )}
                        />
                        {errors.payments?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.payments?.[index]?.amount?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                  <Tooltip title={t('delete')}>
                    <Button variant='outlined' color='error' onClick={() => paymentRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                  </Tooltip>
                </Grid>
              </Grid>
              <Divider sx={{ my: 4 }} />
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button size='large' variant='outlined' color='secondary' startIcon={<PlusIcon fontSize='small' />} onClick={() => paymentAppend(defaultPayment)}>
              {t('add_payment')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} loading={false}>
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

export default SalePaymentsEditDialog;
