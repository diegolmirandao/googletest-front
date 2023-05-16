// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateCustomerReferenceType } from 'src/interfaces/customer/addUpdateReferenceType';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle } from '@mui/material';
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
  onSubmit: (formFields: IAddUpdateCustomerReferenceType) => void;
  onClose: () => void;
}

/**
 * Add and edit customer reference type form
 * @param props component parameters
 * @returns CustomerReferenceType Form Dialog component
 */
const CustomerReferenceTypeAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { customerReferenceTypeReducer: { currentCustomerReferenceType } } = useAppSelector((state) => state);

  const defaultValues: IAddUpdateCustomerReferenceType = {
    name: currentCustomerReferenceType?.name ?? ''
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
          {currentCustomerReferenceType ? t('reference_type_edit') : t('reference_type_add')}
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
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
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

export default CustomerReferenceTypeAddEditDialog;
