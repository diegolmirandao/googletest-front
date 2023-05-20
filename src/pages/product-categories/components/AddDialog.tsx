// ** React Imports
import { useState } from 'react';

// ** Interfaces and Models Imports
import { IAddProductCategory } from 'src/interfaces/product/addCategory';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, Grid, Typography } from '@mui/material';
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

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddProductCategory) => void;
  onClose: () => void;
}

/**
 * Add and edit measurement unit form
 * @param props component parameters
 * @returns ProductCategory Form Dialog component
 */
const ProductCategoryAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Vars
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const defaultValues: IAddProductCategory = {
    name: '',
    subcategories: []
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
    fields: subcategoryFields,
    append: subcategoryAppend,
    update: subcategoryUpdate,
    remove: subcategoryRemove
  } = useFieldArray({
    control,
    name: "subcategories"
  });

  /**
   * Handle new category add event
   */
  const handleNewSubcategoryAdd = () => {
    subcategoryAppend({name: newSubcategory});
    setNewSubcategory('');
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
          {t('category_add')}
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

            <Typography variant='h5' sx={{ mb: 3, textTransform: 'capitalize' }}>{t('subcategories')}</Typography>
            
            {subcategoryFields.map((item, index) => (
              <Grid container spacing={3} sx={{mb: 4}} key={item.id}>
                <Grid item xs>
                  <FormControl fullWidth>
                    <TextField
                      value={item.name}
                      onChange={(e) => subcategoryUpdate(index, {name: e.target.value})}
                    />
                  </FormControl>
                </Grid>
                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                    <Button variant='outlined' color='error' onClick={() => subcategoryRemove(index)}><DeleteIcon /></Button>
                </Grid>
              </Grid>
            ))}

            <Grid container spacing={3} sx={{mb: 4}}>
              <Grid item xs>
                <FormControl fullWidth>
                  <TextField
                    label={t('add_subcategory')}
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyDown={(e) => {if(e.key == 'Enter'){e.preventDefault();handleNewSubcategoryAdd();}}}
                  />
                </FormControl>
              </Grid>
              <Grid item alignItems="stretch" style={{ display: "flex" }}>
                  <Button variant='outlined' color='primary' onClick={handleNewSubcategoryAdd}><PlusIcon /></Button>
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

export default ProductCategoryAddDialog;
