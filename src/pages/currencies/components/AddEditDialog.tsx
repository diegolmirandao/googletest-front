// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateCurrency } from 'src/interfaces/currency/addUpdate';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, InputAdornment } from '@mui/material';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { t } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddUpdateCurrency) => void;
  onClose: () => void;
}

/**
 * Add and edit currency form
 * @param props component parameters
 * @returns Currency Form Dialog component
 */
const CurrencyAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { currencyReducer: { currentCurrency } } = useAppSelector((state) => state);

  const defaultValues: IAddUpdateCurrency = {
    code: currentCurrency?.code ?? '',
    name: currentCurrency?.name ?? '',
    abbreviation: currentCurrency?.abbreviation ?? '',
    exchange_rate: currentCurrency?.exchangeRate ?? 1
  }

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    code: yup.string().required(),
    name: yup.string().required(),
    abbreviation: yup.string().required(),
    exchange_rate: yup.string().required(),
  });

  /**
   * Form
   */
  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  let watchAbbreviation = watch('abbreviation');

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
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='xs'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {currentCurrency ? t('edit_currency') : t('add_currency')}
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
                name='code'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('code')}
                    onChange={onChange}
                    error={Boolean(errors.code)}
                  />
                )}
              />
              {errors.code && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.code.message}`)}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('name')}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.name.message}`)}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='abbreviation'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('abbreviation')}
                    onChange={onChange}
                    error={Boolean(errors.abbreviation)}
                  />
                )}
              />
              {errors.abbreviation && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.abbreviation.message}`)}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='exchange_rate'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('exchange_rate')}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    inputProps={{
                      sx: { textAlign: 'right'}
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>{watchAbbreviation}</InputAdornment>
                    }}
                  />
                )}
              />
              {errors.exchange_rate && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.exchange_rate.message}`)}</FormHelperText>}
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
    </>
  )
};

export default CurrencyAddEditDialog;
