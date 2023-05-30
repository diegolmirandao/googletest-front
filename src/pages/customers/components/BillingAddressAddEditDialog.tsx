// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateCustomerBillingAddress } from 'src/interfaces/customer/addUpdateBillingAddress';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle,  } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';
import PhoneInput from 'src/components/inputmask/PhoneInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  defaultFormValues?: IAddUpdateCustomerBillingAddress;
  onSubmit: (formFields: IAddUpdateCustomerBillingAddress) => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerBillingAddressAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, defaultFormValues, onSubmit, onClose } = props;

  // ** Reducers
  const { customerReducer: { currentCustomerBillingAddress } } = useAppSelector((state) => state);

  // ** Vars
  const defaultValues: IAddUpdateCustomerBillingAddress = defaultFormValues ?? {
    name: currentCustomerBillingAddress?.name ?? '',
    identification_document: currentCustomerBillingAddress?.identificationDocument ?? '',
    phone: currentCustomerBillingAddress?.phone ?? '',
    address: currentCustomerBillingAddress?.address ?? '',
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IAddUpdateCustomerBillingAddress>({
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
        {defaultFormValues || currentCustomerBillingAddress ? t('edit_billing_address') : t('add_billing_address')}
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
                size='small'
                onChange={onChange}
                error={Boolean(errors.name)}
              />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.name.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='identification_document'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                label={t('identification_document')}
                size='small'
                onChange={onChange}
                error={Boolean(errors.identification_document)}
              />
              )}
            />
            {errors.identification_document && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.identification_document.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  value={value}
                  size='small'
                  onChange={onChange}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.phone.message}`)}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='address'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                multiline
                rows={3}
                label={t('address')}
                onChange={onChange}
                error={Boolean(errors.address)}
              />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.address.message}`)}</FormHelperText>}
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

export default CustomerBillingAddressAddEditDialog;
