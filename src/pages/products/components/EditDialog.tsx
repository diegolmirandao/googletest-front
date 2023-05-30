// ** React Imports
import { useEffect } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateProduct } from 'src/interfaces/product/update';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, DialogTitle, Autocomplete, useMediaQuery, useTheme, FormHelperText, Grid, FormControlLabel, Checkbox, Typography, InputAdornment, Tooltip } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, ControllerRenderProps, useFieldArray } from 'react-hook-form';
import { t } from 'i18next';
import { updateSchema } from 'src/schemes/product';
import { MProperty } from 'src/models/product/property';
import { v4 as uuid } from 'uuid';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateProduct) => void;
  onClose: () => void;
}

// ** Property value input render
interface IPropertyValueInput {
  property: MProperty;
  field: ControllerRenderProps<IUpdateProduct, `properties.${number}.value`>;
  index: number;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const ProductEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;

  // ** Reducers
  const { productReducer: { currentProduct }, productTypeReducer: { productTypes }, measurementUnitReducer: { measurementUnits }, productCategoryReducer: { productCategories }, brandReducer: { brands }, productPriceTypeReducer: { productPriceTypes }, propertyReducer: { properties }, variantReducer: { variants }, productCostTypeReducer: { productCostTypes } } = useAppSelector((state) => state);
  
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const productSubcategories = productCategories.map(category => category.subcategories!).flat();
  const propertyOptions = properties.map(property => property.options).flat();

  const defaultValues: IUpdateProduct = {
    codes: currentProduct!.codes,
    name: currentProduct!.name,
    status: currentProduct!.status,
    type_id: currentProduct!.typeId,
    measurement_unit_id: currentProduct!.measurementUnitId,
    category_id: currentProduct!.category.id,
    subcategory_id: currentProduct!.subcategoryId,
    brand_id: currentProduct!.brandId,
    taxed: currentProduct!.taxed,
    tax: currentProduct!.tax,
    percentage_taxed: currentProduct!.percentageTaxed,
    description: currentProduct!.description ?? '',
    properties: properties.filter(property => !property.subcategories.length || !!property.subcategories.find(subcategory => subcategory.id === currentProduct!.subcategoryId)).map(property => ({
      property_id: property.id,
      value: currentProduct!.properties.find(currentProperty => currentProperty.propertyId === property.id)!.value
    }))
  };

  console.log(defaultValues)

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    resetField,
    watch,
    formState: { errors }
  } = useForm<IUpdateProduct>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(updateSchema)
  });

  let watchCategory = watch('category_id');
  let watchSubcategory = watch('subcategory_id');
  let watchTaxed = watch('taxed');

  useEffect(() => {
    const newDefaultSubcategory = productSubcategories.find(subcategory => subcategory.productCategoryId === watchCategory && subcategory.id === defaultValues.subcategory_id) ?? productSubcategories.find(subcategory => subcategory.productCategoryId === watchCategory);
    setValue('subcategory_id', newDefaultSubcategory!.id);
  }, [watchCategory]);

  useEffect(() => {
    const newProperties = properties.filter(property => !property.subcategories.length || !!property.subcategories.find(subcategory => subcategory.id === watchSubcategory)).map(property => ({
      property_id: property.id,
      value: property.hasMultipleValues ? [] : ''
    }));
    setValue('properties', newProperties);
  }, [watchSubcategory]);

  useEffect(() => {
    if (watchTaxed) {
      resetField('tax');
    } else {
      setValue('tax', 0);
    }
  }, [watchTaxed]);

  const {
    fields: propertyFields,
    replace: propertyReplace,
    remove: propertyRemove
  } = useFieldArray({
    control,
    name: "properties",
    keyName: "key"
  });

  const PropertyValueInput: React.FC<IPropertyValueInput> = ({property, field, index}) => {
    switch (property.type) {
      case 'numeric':
        return (
          <TextField
            value={field.value}
            type='numeric'
            label={t('value')}
            size='small'
            onChange={field.onChange}
            error={Boolean(errors.properties?.[index]?.value)}
            inputProps={{
              sx: { textAlign: 'right'}
            }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{measurementUnits.find((measurementUnits) => measurementUnits.id == property.measurementUnitId)?.abbreviation}</InputAdornment>
            }}
          />
        );
      case 'string':
        return (
          <Autocomplete
            freeSolo
            autoSelect
            multiple={!!property.hasMultipleValues}
            disableClearable
            size='small'
            options={[]}
            getOptionLabel={(option) => option}
            value={field.value}
            onChange={(event, newValue) => {field.onChange(newValue)}}
            renderInput={params => <TextField {...params} label={t('value')} />}
          />
        );
      case 'list':
        if (!!property.hasMultipleValues) {
          return (
            <Autocomplete
              multiple
              size='small'
              options={property.options}
              getOptionLabel={option => option.value}
              value={propertyOptions.filter(option => field.value.includes(String(option.id)))}
              onChange={(event, newValue) => {field.onChange([newValue].flat().map(value => String(value?.id)))}}
              renderInput={params => <TextField {...params} label={t('value')} />}
            />
          );
        }
        return (
          <Autocomplete
            size='small'
            options={property.options}
            getOptionLabel={option => option.value}
            value={propertyOptions.find(option => field.value.includes(String(option.id)))}
            onChange={(event, newValue) => {field.onChange([newValue].flat().map(value => String(value?.id)))}}
            renderInput={params => <TextField {...params} label={t('value')} />}
          />
        );
    }
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
        fullScreen={fullScreen}
        open={open}
        maxWidth='xl'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('edit_product')}
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
            <Grid container spacing={3}>
              <Grid item xs={12} lg={3}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='codes'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        freeSolo
                        autoSelect
                        multiple
                        options={[]}
                        value={value}
                        onChange={(event, newValue) => {onChange(newValue)}}
                        renderInput={params => <TextField {...params} label={t('code')} />}
                      />
                    )}
                  />
                  {errors.codes && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.codes.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={7}>
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
              </Grid>
              <Grid item xs={12} lg={2}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                  <FormControlLabel
                    label={t('active')}
                    control={<Checkbox {...field} checked={Boolean(field.value)} />}
                  />
                  )}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs>
                <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('categorization')}</Typography>

                <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                  <Controller
                    name='type_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id="select-type"
                        options={productTypes}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} size='small' label={t('type')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={productTypes.find(type => type.id == value)}
                      />
                    )}
                  />
                  {errors.type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.type_id.message}`)}</FormHelperText>}
                </FormControl>

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
                        renderInput={(params) => <TextField {...params} size='small' label={t('measurement_unit')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={measurementUnits.find(type => type.id == value)}
                      />
                    )}
                  />
                  {errors.measurement_unit_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.measurement_unit_id.message}`)}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                  <Controller
                    name='category_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id="select-category"
                        options={productCategories}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} size='small' label={t('category')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={productCategories.find(category => category.id == value)}
                      />
                    )}
                  />
                  {errors.category_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.category_id.message}`)}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                  <Controller
                    name='subcategory_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id="select-subcategory"
                        options={productSubcategories.filter(subcategory => subcategory.productCategoryId == watchCategory)}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} size='small' label={t('subcategory')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={productSubcategories.find(subcategory => subcategory.id == value)}
                      />
                    )}
                  />
                  {errors.subcategory_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.subcategory_id.message}`)}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                  <Controller
                    name='brand_id'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disableClearable
                        id="select-brand"
                        options={brands}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} size='small' label={t('brand')} />}
                        onChange={(_, data) => {onChange(data?.id)}}
                        value={brands.find(brand => brand.id == value)}
                      />
                    )}
                  />
                  {errors.brand_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.brand_id.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} lg={8}>
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  <Grid item xs={12} lg={4}>
                    <Controller
                      name="taxed"
                      control={control}
                      render={({ field }) => (
                      <FormControlLabel
                        label={t('taxed')}
                        control={<Checkbox {...field} checked={Boolean(field.value)} />}
                      />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <Controller
                        name='tax'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          label={t('tax')}
                          size='small'
                          onChange={onChange}
                          inputProps={{
                            sx: { textAlign: 'right'}
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>
                          }}
                          error={Boolean(errors.tax)}
                        />
                        )}
                      />
                      {errors.tax && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.tax.message}`)}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <Controller
                        name='percentage_taxed'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='number'
                          label={t('percentage_taxed')}
                          size='small'
                          onChange={onChange}
                          inputProps={{
                            sx: { textAlign: 'right'}
                          }}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>
                          }}
                          error={Boolean(errors.percentage_taxed)}
                        />
                        )}
                      />
                      {errors.percentage_taxed && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.percentage_taxed.message}`)}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('properties')}</Typography>

                {propertyFields.map((item, index) => (
                  <Grid container spacing={3} sx={{ mb: 3}} key={item.key}>
                    <Grid item xs={12} lg={5} sx={{ mb: 3}}>
                      <FormControl fullWidth size='small'>
                        <Controller
                          name={`properties.${index}.property_id`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              disableClearable
                              readOnly
                              id={`select-property-${index}`}
                              options={properties}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => <TextField {...params} size='small' label={t('property')} />}
                              onChange={(_, data) => {onChange(data?.id)}}
                              value={properties.find(property => property.id == value)}
                            />
                          )}
                        />
                        {errors.properties?.[index]?.property_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.properties?.[index]?.property_id?.message}`)}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <Controller
                          name={`properties.${index}.value`}
                          control={control}
                          render={({ field }) => <PropertyValueInput property={properties.find(property => property.id == item.property_id)!} field={field} index={index} />}
                        />
                        {errors.properties?.[index]?.value && <FormHelperText sx={{ color: 'error.main' }}>{errors.properties?.[index]?.value?.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    {!!properties.find(property => property.id === item.property_id)!.isRequired && 
                      <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                        <Tooltip title={t('delete')}>
                          <Button variant='outlined' color='error' onClick={() => propertyRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                        </Tooltip>
                      </Grid>
                    }
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label={t('description')}
                  onChange={onChange}
                  error={Boolean(errors.description)}
                />
                )}
              />
              {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.description.message}`)}</FormHelperText>}
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
  );
};

export default ProductEditDialog;
