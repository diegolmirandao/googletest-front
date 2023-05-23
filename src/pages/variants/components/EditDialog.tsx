// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateVariant } from 'src/interfaces/product/updateVariant';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, Autocomplete, Checkbox, styled, lighten, darken, FormControlLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { t } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateVariant) => void;
  onClose: () => void;
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

/**
 * Edit variant form
 * @param props component parameters
 * @returns Variant Form Dialog component
 */
const VariantEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { variantReducer: { currentVariant }, productCategoryReducer: { productCategories } } = useAppSelector((state) => state);
  // ** Vars
  const productSubcategories = productCategories.map(category => category.subcategories).flat();

  const defaultValues: IUpdateVariant = {
    name: currentVariant!.name,
    has_amount_equivalencies: currentVariant!.hasAmountEquivalencies,
    subcategories: currentVariant!.subcategories?.map(subcategory => subcategory.id)
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
    setValue,
    watch,
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
        maxWidth='sm'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('edit_variant')}
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
            <FormControl fullWidth sx={{ mb: 3 }}>
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
                name="has_amount_equivalencies"
                control={control}
                render={({ field }) => (
                <FormControlLabel
                  label={t('has_amount_equivalencies')}
                  control={<Checkbox {...field} checked={Boolean(field.value)} />}
                />
                )}
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Controller
                name='subcategories'
                control={control}
                render={({ field: { value } }) => (
                  <Autocomplete
                    multiple
                    openOnFocus
                    options={productSubcategories}
                    disableCloseOnSelect
                    limitTags={5}
                    getOptionLabel={option => option.name}
                    groupBy={(option) => String(option.productCategoryId)}
                    renderGroup={(params) => (
                      <li key={params.key}>
                        <GroupHeader>{productCategories.find(category => category.id === Number(params.group))?.name}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                      </li>
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    )}
                    onChange={(_, data) => {setValue('subcategories', data.map(value => Number(value.id)))}}
                    renderInput={params => <TextField {...params} label={t('subcategories')} sx={{ mb: 3 }} />}
                    value={value.map(val => productSubcategories.find(subcategory => subcategory.id == val)!)}
                  />
                )}
              />
              {errors.subcategories && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.subcategories.message}`)}</FormHelperText>}
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

export default VariantEditDialog;
