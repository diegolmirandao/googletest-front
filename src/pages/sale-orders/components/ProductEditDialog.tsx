// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateSaleOrderProduct } from 'src/interfaces/sale-order/updateProduct';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';
import NumericInput from 'src/components/inputmask/NumericInput';
import DecimalPercentageInput from 'src/components/inputmask/DecimalPercentageInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateSaleOrderProduct) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const SaleOrderProductEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleOrderReducer: { currentSaleOrderProduct } } = useAppSelector((state) => state);
  // ** Vars
  const defaultValues: IUpdateSaleOrderProduct = {
    quantity: currentSaleOrderProduct?.quantity ?? 0,
    billed_quantity: currentSaleOrderProduct?.billedQuantity ?? 0,
    canceled_quantity: currentSaleOrderProduct?.canceledQuantity ?? 0,
    discount: currentSaleOrderProduct?.discount ?? 0,
    comments: currentSaleOrderProduct?.comments ? currentSaleOrderProduct?.comments : ''
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
  } = useForm<IUpdateSaleOrderProduct>({
    defaultValues,
    mode: 'onChange'
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
      maxWidth='sm'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {currentSaleOrderProduct ? t('edit_product') : t('add_product')}
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
              name='quantity'
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericInput
                  value={value}
                  label={t('quantity')}
                  onChange={onChange}
                  measurementUnit={currentSaleOrderProduct!.measurementUnit}
                  error={Boolean(errors.quantity)}
                />
              )}
            />
            {errors.quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.quantity.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='billed_quantity'
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericInput
                  value={value}
                  label={t('billed_quantity')}
                  onChange={onChange}
                  measurementUnit={currentSaleOrderProduct!.measurementUnit}
                  error={Boolean(errors.billed_quantity)}
                />
              )}
            />
            {errors.billed_quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.billed_quantity.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='canceled_quantity'
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericInput
                  value={value}
                  label={t('canceled_quantity')}
                  onChange={onChange}
                  measurementUnit={currentSaleOrderProduct!.measurementUnit}
                  error={Boolean(errors.canceled_quantity)}
                />
              )}
            />
            {errors.canceled_quantity && <FormHelperText sx={{ color: 'error.main' }}>{errors.canceled_quantity.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='discount'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DecimalPercentageInput
                  value={value}
                  label={t('discount')}
                  onChange={(e) => onChange(Number(e.target.value))}
                  error={Boolean(errors.discount)}
                />
              )}
            />
            {errors.discount && <FormHelperText sx={{ color: 'error.main' }}>{errors.discount.message}</FormHelperText>}
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

export default SaleOrderProductEditDialog;
