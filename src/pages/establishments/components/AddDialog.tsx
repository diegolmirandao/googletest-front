// ** React Imports
import { useState } from 'react';

// ** Interfaces and Models Imports
import { IAddEstablishment } from 'src/interfaces/establishment/add';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, Grid, Typography, Autocomplete } from '@mui/material';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteIcon from 'mdi-material-ui/Delete';
import PlusIcon from 'mdi-material-ui/Plus';

// ** Third Party Imports
import { t } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useAppSelector } from 'src/hooks/redux';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddEstablishment) => void;
  onClose: () => void;
}

/**
 * Add and edit measurement unit form
 * @param props component parameters
 * @returns Establishment Form Dialog component
 */
const EstablishmentAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { businessReducer: { businesses } } = useAppSelector((state) => state);
  // ** Vars
  const [newpointOfSale, setNewpointOfSale] = useState<number>(2);
  const defaultValues: IAddEstablishment = {
    business_id: 1,
    name: '',
    points_of_sale: [
      { number: 1 }
    ]
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

  const {
    fields: pointOfSaleFields,
    append: pointOfSaleAppend,
    update: pointOfSaleUpdate,
    remove: pointOfSaleRemove
  } = useFieldArray({
    control,
    name: "points_of_sale"
  });

  /**
   * Handle new establishment add event
   */
  const handleNewpointOfSaleAdd = () => {
    pointOfSaleAppend({number: newpointOfSale});
    setNewpointOfSale(newpointOfSale + 1);
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
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='xs'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('add_establishment')}
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
                name='business_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    disableClearable
                    id="select-business"
                    options={businesses}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label={t('business')} />}
                    onChange={(_, data) => {onChange(data?.id)}}
                    value={businesses.find(business => business.id == value)}
                  />
                )}
              />
              {errors.business_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.business_id.message}`)}</FormHelperText>}
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

            <Typography variant='h5' sx={{ mb: 3, textTransform: 'capitalize' }}>{t('points_of_sale')}</Typography>
            
            {pointOfSaleFields.map((item, index) => (
              <Grid container spacing={3} sx={{mb: 4}} key={item.id}>
                <Grid item xs>
                  <FormControl fullWidth>
                    <TextField
                      value={item.number}
                      onChange={(e) => pointOfSaleUpdate(index, {number: Number(e.target.value)})}
                    />
                  </FormControl>
                </Grid>
                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                    <Button variant='outlined' color='error' onClick={() => pointOfSaleRemove(index)}><DeleteIcon /></Button>
                </Grid>
              </Grid>
            ))}

            <Grid container spacing={3} sx={{mb: 4}}>
              <Grid item xs>
                <FormControl fullWidth>
                  <TextField
                    label={t('add_point_of_sale')}
                    value={newpointOfSale}
                    onChange={(e) => setNewpointOfSale(Number(e.target.value))}
                    onKeyDown={(e) => {if(e.key == 'Enter'){e.preventDefault();handleNewpointOfSaleAdd();}}}
                  />
                </FormControl>
              </Grid>
              <Grid item alignItems="stretch" style={{ display: "flex" }}>
                  <Button variant='outlined' color='primary' onClick={handleNewpointOfSaleAdd}><PlusIcon /></Button>
              </Grid>
            </Grid>
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

export default EstablishmentAddDialog;
