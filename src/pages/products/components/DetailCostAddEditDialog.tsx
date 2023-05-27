// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateProductDetailCost } from 'src/interfaces/product/addUpdateDetailCost';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete, Tooltip, Select, Typography } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { t } from 'i18next';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddUpdateProductDetailCost) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const ProductDetailCostAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { productReducer: { currentProductDetailCost }, currencyReducer: { currencies }, productCostTypeReducer: { productCostTypes } } = useAppSelector((state) => state);
  // ** Vars
  const defaultValues: IAddUpdateProductDetailCost = {
    cost_type_id: currentProductDetailCost?.type.id ?? 1,
    currency_id: currentProductDetailCost?.currency.id ?? 1,
    amount: currentProductDetailCost?.amount ?? 0
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<IAddUpdateProductDetailCost>({
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
      maxWidth='md'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {currentProductDetailCost ? t('edit_cost') : t('add_cost')}
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
              name='cost_type_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  disableClearable
                  id={'select-cost-type'}
                  options={productCostTypes}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label={t('list')} />}
                  onChange={(_, data) => {onChange(data?.id)}}
                  value={productCostTypes.find(type => type.id == value)}
                />
              )}
            />
            {errors.cost_type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.cost_type_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='currency_id'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  disableClearable
                  id={'select-currency'}
                  options={currencies}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label={t('currency')} />}
                  onChange={(_, data) => {onChange(data?.id)}}
                  value={currencies.find(currency => currency.id == value)}
                />
              )}
            />
            {errors.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.currency_id.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='amount'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                type='number'
                label={t('amount')}
                onChange={onChange}
                error={Boolean(errors.amount)}
                inputProps={{
                  sx: { textAlign: 'right'}
                }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues('currency_id'))?.abbreviation}</InputAdornment>
                }}
              />
              )}
            />
            {errors.amount && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.amount.message}`)}</FormHelperText>}
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

export default ProductDetailCostAddEditDialog;
