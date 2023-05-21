// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateProperty } from 'src/interfaces/product/updateProperty';

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
import { EPropertyType } from 'src/enums/propertyType';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateProperty) => void;
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
 * Edit property form
 * @param props component parameters
 * @returns Property Form Dialog component
 */
const PropertyEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { propertyReducer: { currentProperty }, productCategoryReducer: { productCategories }, measurementUnitReducer: { measurementUnits } } = useAppSelector((state) => state);
  // ** Vars
  const [showMeasurementUnitField, setShowMeasurementUnitField] = useState<boolean>(false);
  const productSubcategories = productCategories.map(category => category.subcategories).flat();
  const propertyTypes = Object.entries(EPropertyType).map(([key, value]) => ({value: key, text: String(value)}));

  const defaultValues: IUpdateProperty = {
    name: currentProperty!.name,
    type: currentProperty!.type,
    measurement_unit_id: currentProperty!.measurementUnitId ?? '',
    has_multiple_values: currentProperty!.hasMultipleValues,
    is_required: currentProperty!.isRequired,
    subcategories: currentProperty!.subcategories?.map(subcategory => subcategory.id)
  }

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    name: yup.string().required(),
    type: yup.string().required(),
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

  const watchType = watch('type');

  useEffect(() => {
    setShowMeasurementUnitField(watchType == 'numeric');
  }, [watchType]);

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
          {t('edit_property')}
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

            <FormControl fullWidth sx={{ mb: 6 }} size='small'>
              <Controller
                name='type'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    disableClearable
                    id="select-type"
                    options={propertyTypes}
                    getOptionLabel={(option) => t(option.text)}
                    renderInput={(params) => <TextField {...params} label={t('type')} />}
                    onChange={(_, data) => {onChange(data?.value)}}
                    value={propertyTypes.find(type => type.value == value)}
                  />
                )}
              />
              {errors.type && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.type.message}`)}</FormHelperText>}
            </FormControl>

            {showMeasurementUnitField &&
              <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                <Controller
                  name='measurement_unit_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      disableClearable
                      id="select-measurement-unit"
                      options={measurementUnits}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label={t('measurement_unit')} />}
                      onChange={(_, data) => {onChange(data?.id)}}
                      value={measurementUnits.find(measurementUnit => measurementUnit.id == value)}
                    />
                  )}
                />
                {errors.measurement_unit_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.measurement_unit_id.message}`)}</FormHelperText>}
              </FormControl>
            }
            
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

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Controller
                name="has_multiple_values"
                control={control}
                render={({ field }) => (
                <FormControlLabel
                  label={t('property_can_have_more_than_one_value_at_once')}
                  control={<Checkbox {...field} checked={Boolean(field.value)} />}
                />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Controller
                name="is_required"
                control={control}
                render={({ field }) => (
                <FormControlLabel
                  label={t('is_required_field')}
                  control={<Checkbox {...field} checked={Boolean(field.value)} />}
                />
                )}
              />
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

export default PropertyEditDialog;
