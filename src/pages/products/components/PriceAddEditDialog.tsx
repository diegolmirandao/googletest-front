// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateProductPrice } from 'src/interfaces/product/addUpdatePrice';
import { IAddUpdateProductDetailPrice } from 'src/interfaces/product/addDetailPrice';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, styled, Grid, InputLabel, MenuItem, InputAdornment, Autocomplete, Tooltip, Select, Typography } from '@mui/material';
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
  defaultFormValues?: IAddUpdateProductPrice;
  onSubmit: (formFields: IAddUpdateProductPrice) => void;
  onClose: () => void;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const ProductPriceAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, defaultFormValues, onSubmit, onClose } = props;
  // ** Reducers
  const { currencyReducer: { currencies }, productPriceTypeReducer: { productPriceTypes }, productCostTypeReducer: { productCostTypes } } = useAppSelector((state) => state);
  // ** Vars
  const defaultValues: IAddUpdateProductPrice = defaultFormValues ?? {
    costs: productCostTypes.map((type) => ({
      cost_type_id: type.id,
      currency_id: 1,
      amount: 0
    })),
    prices: productPriceTypes.map((type) => ({
      price_type_id: type.id,
      currency_id: 1,
      amount: 0
    })),
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
  } = useForm<IAddUpdateProductPrice>({
    defaultValues,
    mode: 'onChange'
  });

  const {
    fields: costFields,
    remove: costRemove
  } = useFieldArray({
    control,
    name: "costs"
  });

  const {
    fields: priceFields,
    remove: priceRemove
  } = useFieldArray({
    control,
    name: "prices"
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
        {t('edit_prices')}
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
          <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('costs')}</Typography>

          {costFields.map((item, index) => (
            <Grid container spacing={3} sx={{ mb: 3}} key={index}>
              <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`costs.${index}.cost_type_id`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id={`select-cost-type-${index}`}
                        options={productCostTypes}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={t('list')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={productCostTypes.find(type => type.id == value)}
                      />
                    )}
                  />
                  {errors.costs?.[index]?.cost_type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.cost_type_id?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`costs.${index}.currency_id`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id={`select-currency-${index}`}
                        options={currencies}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={t('currency')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={currencies.find(currency => currency.id == value)}
                      />
                    )}
                  />
                  {errors.costs?.[index]?.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.currency_id?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`costs.${index}.amount`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      type='number'
                      label={t('amount')}
                      onChange={onChange}
                      error={Boolean(errors.costs?.[index]?.amount)}
                      inputProps={{
                        sx: { textAlign: 'right'}
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues(`costs.${index}.currency_id`))?.abbreviation}</InputAdornment>
                      }}
                    />
                    )}
                  />
                  {errors.costs?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.amount?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                <Tooltip title={t('delete')}>
                  <Button variant='outlined' color='error' onClick={() => costRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                </Tooltip>
              </Grid>
            </Grid>
          ))}

          <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('prices')}</Typography>

          {priceFields.map((item, index) => (
            <Grid container spacing={3} sx={{ mb: 3}} key={index}>
              <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`prices.${index}.price_type_id`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id={`select-price-type-${index}`}
                        options={productPriceTypes}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={t('list')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={productPriceTypes.find(type => type.id == value)}
                      />
                    )}
                  />
                  {errors.prices?.[index]?.price_type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.price_type_id?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`prices.${index}.currency_id`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id={`select-currency-${index}`}
                        options={currencies}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label={t('currency')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={currencies.find(currency => currency.id == value)}
                      />
                    )}
                  />
                  {errors.prices?.[index]?.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.currency_id?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs sx={{ mb: 3}}>
                <FormControl fullWidth>
                  <Controller
                    name={`prices.${index}.amount`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      type='number'
                      label={t('amount')}
                      onChange={onChange}
                      error={Boolean(errors.prices?.[index]?.amount)}
                      inputProps={{
                        sx: { textAlign: 'right'}
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues(`prices.${index}.currency_id`))?.abbreviation}</InputAdornment>
                      }}
                    />
                    )}
                  />
                  {errors.prices?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.amount?.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                <Tooltip title={t('delete')}>
                  <Button variant='outlined' color='error' onClick={() => priceRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
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

export default ProductPriceAddEditDialog;
