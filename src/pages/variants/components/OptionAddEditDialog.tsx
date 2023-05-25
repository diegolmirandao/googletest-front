// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateVariantOption } from 'src/interfaces/product/addUpdateVariantOption';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, Autocomplete } from '@mui/material';
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
  onSubmit: (formFields: IAddUpdateVariantOption) => void;
  onClose: () => void;
}

/**
 * Add and edit measurement unit form
 * @param props component parameters
 * @returns VariantOption Form Dialog component
 */
const VariantOptionAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { variantReducer: { currentVariant, currentVariantOption } } = useAppSelector((state) => state);

  const defaultValues: IAddUpdateVariantOption = {
    name: currentVariantOption?.name ?? ''
  }

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  /**
   * Form
   */
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
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
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='xs'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {currentVariantOption ? t('edit_option') : t('add_option')}
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

            {!!currentVariant?.hasAmountEquivalencies &&
              <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                <Controller
                  name='equivalent_variant_option_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      disableClearable
                      id="select-equivalent-variant-option"
                      options={currentVariant.options}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label={t('equivalent_to')} />}
                      onChange={(_, data) => {onChange(data?.id)}}
                      value={currentVariant.options.find(option => option.id == value)}
                    />
                  )}
                />
                {errors.equivalent_variant_option_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.equivalent_variant_option_id.message}`)}</FormHelperText>}
              </FormControl>
            }

            {!!currentVariant?.hasAmountEquivalencies &&
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='equivalent_amount'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={'number'}
                      value={value}
                      label='Cantidad equivalente'
                      onChange={onChange}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.equivalent_amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.equivalent_amount.message}</FormHelperText>}
              </FormControl>
            }
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

export default VariantOptionAddEditDialog;
