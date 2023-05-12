// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateCustomerAddress } from 'src/interfaces/customer/addUpdateAddress';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, styled } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MuiTab, { TabProps } from '@mui/material/Tab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  selectedAddress?: IAddUpdateCustomerAddress;
  onSubmit: (formFields: IAddUpdateCustomerAddress) => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerAddressAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, selectedAddress, onSubmit, onClose } = props;
  // ** Reducers
  const { customerReducer: { currentCustomerAddress } } = useAppSelector((state) => state);
  // ** Vars
  const defaultValues: IAddUpdateCustomerAddress = {
    zone_id: selectedAddress?.zone_id ?? currentCustomerAddress?.zoneId ?? 1,
    name: selectedAddress?.name ?? currentCustomerAddress?.name ?? '',
    phone: selectedAddress?.phone ?? currentCustomerAddress?.phone ?? '',
    address: selectedAddress?.address ?? currentCustomerAddress?.address ?? '',
    reference: selectedAddress?.reference ?? currentCustomerAddress?.reference ?? '',
    lat: selectedAddress?.lat ?? currentCustomerAddress?.lat ?? 0,
    lng: selectedAddress?.lng ?? currentCustomerAddress?.lng ?? 0,
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
  } = useForm<IAddUpdateCustomerAddress>({
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
        {selectedAddress || currentCustomerAddress ? 'EDITAR DIRECCIÓN' : 'AGREGAR DIRECCIÓN'}
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
                label='Nombre'
                size='small'
                onChange={onChange}
                error={Boolean(errors.name)}
              />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                label='Telefono'
                size='small'
                onChange={onChange}
                error={Boolean(errors.phone)}
              />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
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
                label='Dirección'
                onChange={onChange}
                error={Boolean(errors.address)}
              />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='reference'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                multiline
                rows={3}
                label='Referencias'
                onChange={onChange}
                error={Boolean(errors.address)}
              />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} loading={loading}>
            Guardar
          </LoadingButton>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerAddressAddEditDialog;
