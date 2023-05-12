// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateCustomerReference } from 'src/interfaces/customer/addUpdateReference';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  selectedReference?: IAddUpdateCustomerReference;
  onSubmit: (formFields: IAddUpdateCustomerReference) => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerReferenceAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, selectedReference, onSubmit, onClose } = props;

  // ** Reducers
  const { customerReducer: { currentCustomerReference } } = useAppSelector((state) => state);
  
  // ** Vars
  const defaultValues: IAddUpdateCustomerReference = {
    name: selectedReference?.name ?? currentCustomerReference?.name ?? '',
    identification_document: selectedReference?.identification_document ?? currentCustomerReference?.identificationDocument ?? '',
    phone: selectedReference?.phone ?? currentCustomerReference?.phone ?? '',
    email: selectedReference?.email ?? currentCustomerReference?.email ?? '',
    address: selectedReference?.address ?? currentCustomerReference?.address ?? '',
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
  } = useForm<IAddUpdateCustomerReference>({
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
        {selectedReference || currentCustomerReference ? 'EDITAR REFERENCIA' : 'AGREGAR REFERENCIA'}
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
              name='identification_document'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                label='RUC/CI'
                size='small'
                onChange={onChange}
                error={Boolean(errors.identification_document)}
              />
              )}
            />
            {errors.identification_document && <FormHelperText sx={{ color: 'error.main' }}>{errors.identification_document.message}</FormHelperText>}
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
              name='email'
              control={control}
              render={({ field: { value, onChange } }) => (
              <TextField
                value={value}
                label='Email'
                size='small'
                onChange={onChange}
                error={Boolean(errors.email)}
              />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
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

export default CustomerReferenceAddEditDialog;
