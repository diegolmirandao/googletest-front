// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateSaleInstalment } from 'src/interfaces/sale/updateInstalment';
import { ICurrency } from 'src/interfaces/currency/currency';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, styled, Grid, Typography, InputAdornment, Autocomplete } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers-pro';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { MCurrency } from 'src/models/currency';
import { EExpirationInterval } from 'src/enums/expirationInterval';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { v4 as uuid } from 'uuid';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  date?: Dayjs | null;
  selectedInstalments?: IUpdateSaleInstalment[];
  currency?: MCurrency;
  totalAmount: number;
  onSubmit: (formFields: IUpdateSaleInstalment[]) => void;
  onClose: () => void;
}

/**
 * Sale edit dialog
 * @param props component parameters
 * @returns Sale Edit Dialog component
 */
const SaleInstalmentEditDialog = (props: IProps) => {
  // ** Props
  const { open, date, selectedInstalments, currency, totalAmount, onSubmit, onClose } = props;
  // ** Vars
  const [mounted, setMounted] = useState<boolean>(false);
  const initialAmountOfInstalments = (selectedInstalments?.length ?? 0) - (selectedInstalments?.[0]?.number === 0 ? 1 : 0) || 1;
  const initialFirstInstanlemtExpiresAt = selectedInstalments?.[0]?.number === 0 ? selectedInstalments?.[1].expires_at : dayjs(date).add(1, 'month');
  const initialDownPayment = selectedInstalments?.[0]?.number === 0 ? selectedInstalments?.[0].amount : 0;

  const expirationIntervals = Object.entries(EExpirationInterval).map(([key, value]) => ({value: key, name: String(value)}));
  const [amountOfInstalments, setAmountOfInstalments] = useState<number>(initialAmountOfInstalments);
  const [expirationInterval, setExpirationInterval] = useState<string>('month');
  const [firstInstalmentExpiresAt, setFirstInstalmentExpiresAt] = useState<Dayjs | null>(initialFirstInstanlemtExpiresAt);
  const [downPayment, setDownPayment] = useState<number>(initialDownPayment);
  const defaultValues: {
    instalments: IUpdateSaleInstalment[];
  } = {
    instalments: selectedInstalments?.length ? selectedInstalments : [{
      id: null,
      number: 1,
      expires_at: dayjs(date).add(1, 'month'),
      amount: totalAmount
    }]
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
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const {
    fields: instalmentFields,
    update: instalmentUpdate,
    replace: instalmentReplace
  } = useFieldArray({
    control,
    name: "instalments",
    keyName: "key"
  });

  useEffect(() => {
    if (mounted || !selectedInstalments) {
      getGeneratedInstalments();
    }
    setMounted(true);
  }, [amountOfInstalments, expirationInterval, firstInstalmentExpiresAt, downPayment]);

  /**
   * Re generate instalments if changes occur
   */
  const getGeneratedInstalments = () => {
    let instalments: IUpdateSaleInstalment[] =  downPayment > 0 ? [{
      id: null,
      number: 0,
      expires_at: dayjs(date),
      amount: downPayment
    }] : [];
    const instalmentAmount = (totalAmount - downPayment) / amountOfInstalments;
    for (let i = 1; i <= amountOfInstalments; i++) {
      instalments = [...instalments, {
        id: null,
        number: i,
        expires_at: firstInstalmentExpiresAt?.add(i-1, expirationInterval as ManipulateType) ?? null,
        amount: instalmentAmount
      }]
    }
    instalmentReplace(instalments);
    console.log(instalments);
  };

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
      maxWidth='lg'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {t('edit_instalments')}
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit((data) => onSubmit(data.instalments))}>
        <DialogContent>
          <Grid container>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  type='number'
                  value={amountOfInstalments}
                  label={t('amount_of_instalments')}
                  onChange={(e) => setAmountOfInstalments(Number(e.target.value))}
                  inputProps={{
                    sx: { textAlign: 'right'},
                    min: 1
                  }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 6 }}>
                <Autocomplete
                  openOnFocus
                  disableClearable
                  options={expirationIntervals}
                  getOptionLabel={option => option.name}
                  onChange={(event, newValue) => setExpirationInterval(newValue.value)}
                  value={expirationIntervals.find(e => e.value == expirationInterval)}
                  renderInput={params => <TextField {...params} label={t('expiration')} />}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 6 }}>
                <DatePicker
                  label={t('first_instalment_expires_at')}
                  value={firstInstalmentExpiresAt}
                  format='DD-MM-YYYY'
                  onChange={(newValue) => setFirstInstalmentExpiresAt(newValue)}
                  slotProps={{ textField: { } }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  type='number'
                  value={downPayment}
                  label={t('down_payment')}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  inputProps={{
                    sx: { textAlign: 'right' }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>{currency?.abbreviation}</InputAdornment>
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8} paddingLeft={6}>
              <Typography variant='h5' mb={3} ml={3}>{t('instalments')}</Typography>
              {instalmentFields.map((instalment, index) => {
                if (instalment.number === 0) return;
                return (
                  <Grid container spacing={3} mb={3} key={instalment.key}>
                    <Grid item>
                      <Typography variant='h5'>{instalment.number}</Typography>
                    </Grid>
                    <Grid item xs>
                      <FormControl fullWidth>
                        <Controller
                          name={`instalments.${index}.expires_at`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <DatePicker
                              label={t('expires_at')}
                              value={value}
                              format='DD-MM-YYYY'
                              onChange={(newValue) => onChange(newValue)}
                              slotProps={{ textField: { size: 'small' } }}
                            />
                          )}
                        />
                        {errors.instalments?.[index]?.expires_at && <FormHelperText sx={{ color: 'error.main' }}>{errors.instalments?.[index]?.expires_at?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl fullWidth>
                        <Controller
                          name={`instalments.${index}.amount`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            key={value}
                            type='number'
                            label={t('amount')}
                            size='small'
                            onChange={onChange}
                            error={Boolean(errors.instalments?.[index]?.amount)}
                            inputProps={{
                              sx: { textAlign: 'right'}
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>{currency?.abbreviation}</InputAdornment>
                            }}
                          />
                          )}
                        />
                        {errors.instalments?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.instalments?.[index]?.amount?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
              );})}
            </Grid>
          </Grid>
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

export default SaleInstalmentEditDialog;
