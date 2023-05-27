// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddProduct } from 'src/interfaces/product/add';
import { MProperty } from 'src/models/product/property';
import { IAddProductDetail } from 'src/interfaces/product/addDetail';
import { MVariant } from 'src/models/product/variant';
import { IAddUpdateProductDetailPrice } from 'src/interfaces/product/addDetailPrice';
import { IAddUpdateProductPrice } from 'src/interfaces/product/addUpdatePrice';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, Box, Typography, styled, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme, InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import MuiTab, { TabProps } from '@mui/material/Tab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import LanIcon from 'mdi-material-ui/Lan';
import ImageTextIcon from 'mdi-material-ui/ImageText';
import FileDocumentOutlineIcon from 'mdi-material-ui/FileDocumentOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import CashMultipleIcon from 'mdi-material-ui/CashMultiple';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray, ControllerRenderProps } from 'react-hook-form';
import { addSchema } from 'src/schemes/product';
import { t } from 'i18next';
import Tab from 'src/components/mui/Tab';
import { v4 as uuid } from 'uuid';
import ProductPriceAddEditDialog from './PriceAddEditDialog';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddProduct) => void;
  onClose: () => void;
}

// ** Property value input render
interface IPropertyValueInput {
  property: MProperty;
  field: ControllerRenderProps<IAddProduct, `properties.${number}.value`>;
  index: number;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const ProductAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { currencyReducer: { currencies }, productTypeReducer: { productTypes }, measurementUnitReducer: { measurementUnits }, productCategoryReducer: { productCategories }, brandReducer: { brands }, productPriceTypeReducer: { productPriceTypes }, propertyReducer: { properties }, variantReducer: { variants }, productCostTypeReducer: { productCostTypes } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');

  const productSubcategories = productCategories.map(category => category.subcategories!).flat();
  const propertyOptions = properties.map(property => property.options).flat();

  const [selectedDetailIndex, setSelectedDetailIndex] = useState<number>(0);
  const [selectedDetailPrices, setSelectedDetailPrices] = useState<IAddUpdateProductPrice | undefined>();
  const [openPriceAddEditDialog, setOpenPriceAddEditDialog] = useState<boolean>(false);

  const defaultValues: IAddProduct = {
    name: '',
    status: true,
    type_id: 1,
    measurement_unit_id: 1,
    category_id: 1,
    subcategory_id: 1,
    brand_id: 1,
    taxed: true,
    tax: 10,
    percentage_taxed: 100,
    description: '',
    codes: [],
    descriptions: [],
    images: [],
    costs: productCostTypes.map((type) => ({
      cost_type_id: type.id,
      currency_id: 1,
      amount: 0
    })),
    prices: productPriceTypes.map((type) => ({
      price_type_id: type.id,
      currency_id: 1,
      amount: 0
    })),
    properties: properties.filter(property => !property.subcategories.length || !!property.subcategories.find(subcategory => subcategory.id === 1)).map(property => ({
      property_id: property.id,
      value: property.hasMultipleValues ? [] : ''
    })),
    variants: [],
    details: []
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    resetField,
    formState: { errors }
  } = useForm<IAddProduct>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(addSchema)
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
    fields: costFields,
    remove: costRemove
  } = useFieldArray({
    control,
    name: "costs"
  });

  const {
    fields: priceFields,
    remove: priceRemove
  } = useFieldArray({
    control,
    name: "prices"
  });

  const {
    fields: propertyFields,
    replace: propertyReplace,
    remove: propertyRemove
  } = useFieldArray({
    control,
    name: "properties"
  });

  const {
    fields: detailFields,
    replace: detailReplace,
    remove: detailRemove
  } = useFieldArray({
    control,
    name: "details"
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
   * Tab change event handler
   * @param event tab change event
   * @param newValue new selected tab
   */
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  /**
   * Product price add event submit handler
   * @param formFields form fields submitted by user
   */
  const handlePriceEditSubmit = (formFields: IAddUpdateProductPrice) => {
    setValue(`details.${selectedDetailIndex}.costs`, formFields.costs);
    setValue(`details.${selectedDetailIndex}.prices`, formFields.prices);
    console.log(formFields)
    setOpenPriceAddEditDialog(false);
  };

  /**
   * Detail Price edit click event handler
   * @param index selected detail index
   * @param selecetedPrices current detail prices
   */
  const handleDetailPriceEditClick = (index: number) => {
    setSelectedDetailIndex(index);
    setSelectedDetailPrices({costs: getValues(`details.${index}.costs`), prices: getValues(`details.${index}.prices`)});
    setOpenPriceAddEditDialog(true);
  };

  /**
   * Variant select change event handler
   * @param e select change evet
   * @param selectedVariants selected variants
   */
  const handleVariationChange = (e: SyntheticEvent<Element, Event>, selectedVariants: MVariant[]) => {
    setValue('variants', selectedVariants);
    const variantValuesQuantities = selectedVariants.map(variant => variant.options.length);
    let variantCombinations = variantValuesQuantities.reduce((a, b) => a * b, 1);
    let maxVariantQuantityToIndex = 0;
    let variantIndexOptions: number[][] = [...Array(variantCombinations)];
    for (let productNumber = 0; productNumber < variantCombinations; productNumber++) {
      variantIndexOptions[productNumber] = [...Array(selectedVariants.length)];
      variantValuesQuantities.map((quantity, index) => {
        maxVariantQuantityToIndex = variantValuesQuantities.filter((element, index2) => index2 > index).reduce((a, b) => a * b, 1);
        variantIndexOptions[productNumber][index] = Math.floor(productNumber / maxVariantQuantityToIndex);
        while (variantIndexOptions[productNumber][index] >= quantity) {
          variantIndexOptions[productNumber][index] = variantIndexOptions[productNumber][index] - quantity;
        }
      });
    }
    let details: IAddProductDetail[] = [...Array(variantCombinations)].map((element, index) => ({
      status: true,
      codes: [],
      descriptions: [],
      images: [],
      variants: selectedVariants.map((variant, variantIndex) => ({ option_id: variant.options[variantIndexOptions[index][variantIndex]].id })),
      costs: getValues('costs'),
      prices: getValues('prices')
    }));
    detailReplace(details);
  };

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
          {t('add_product')}
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
            <TabContext value={tabValue}>
              <TabList
                onChange={handleTabChange}
              >
                <Tab value='definition' label={t('definition')} icon={<FileDocumentOutlineIcon />} />
                <Tab value='prices' label={t('prices')} icon={<CashMultipleIcon />} />
                <Tab value='variants' label={t('variants')} icon={<LanIcon />} />
                <Tab value='descriptions' label={t('multimedia')} icon={<ImageTextIcon />} />
                <Tab value='parameters' label={t('parameters')} icon={<FileCogOutlineIcon />} />
              </TabList>
              <Box sx={{ mt: 3 }}>
                <TabPanel value='definition'>
                  {/*
                    START PRODUCT DEFINITION
                  */}
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
                        <Grid container spacing={3} sx={{ mb: 3}} key={uuid()}>
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
                          {!properties.find(property => property.id === item.property_id)!.isRequired && 
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
                  {/*
                    END PRODUCT DEFINITION
                  */}
                </TabPanel>
                <TabPanel value='prices'>
                  {/*
                    START PRODUCT PRICES
                  */}
                  <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('costs')}</Typography>

                  {costFields.map((item, index) => (
                    <Grid container spacing={3} sx={{ mb: 3}} key={uuid()}>
                      <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`costs.${index}.cost_type_id`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                disableClearable
                                id={`select-cost-type-${index}`}
                                options={productCostTypes}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label={t('list')} />}
                                onChange={(_, data) => {onChange(data?.id)}}
                                value={productCostTypes.find(type => type.id == value)}
                              />
                            )}
                          />
                          {errors.costs?.[index]?.cost_type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.cost_type_id?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`costs.${index}.currency_id`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                disableClearable
                                id={`select-currency-${index}`}
                                options={currencies}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label={t('currency')} />}
                                onChange={(_, data) => {onChange(data?.id)}}
                                value={currencies.find(currency => currency.id == value)}
                              />
                            )}
                          />
                          {errors.costs?.[index]?.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.currency_id?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControl fullWidth>
                          <Controller
                            name={`costs.${index}.amount`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              type='number'
                              label={t('amount')}
                              onChange={onChange}
                              error={Boolean(errors.costs?.[index]?.amount)}
                              inputProps={{
                                sx: { textAlign: 'right'}
                              }}
                              InputProps={{
                                endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues(`costs.${index}.currency_id`))?.abbreviation}</InputAdornment>
                              }}
                            />
                            )}
                          />
                          {errors.costs?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.costs?.[index]?.amount?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('delete')}>
                          <Button variant='outlined' color='error' onClick={() => costRemove(index)}><DeleteOutlineIcon /></Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}

                  <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('prices')}</Typography>

                  {priceFields.map((item, index) => (
                    <Grid container spacing={3} sx={{ mb: 3}} key={uuid()}>
                      <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`prices.${index}.price_type_id`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                disableClearable
                                id={`select-price-type-${index}`}
                                options={productPriceTypes}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label={t('list')} />}
                                onChange={(_, data) => {onChange(data?.id)}}
                                value={productPriceTypes.find(type => type.id == value)}
                              />
                            )}
                          />
                          {errors.prices?.[index]?.price_type_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.price_type_id?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`prices.${index}.currency_id`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                disableClearable
                                id={`select-currency-${index}`}
                                options={currencies}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label={t('currency')} />}
                                onChange={(_, data) => {onChange(data?.id)}}
                                value={currencies.find(currency => currency.id == value)}
                              />
                            )}
                          />
                          {errors.prices?.[index]?.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.currency_id?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControl fullWidth>
                          <Controller
                            name={`prices.${index}.amount`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              type='number'
                              label={t('amount')}
                              onChange={onChange}
                              error={Boolean(errors.prices?.[index]?.amount)}
                              inputProps={{
                                sx: { textAlign: 'right'}
                              }}
                              InputProps={{
                                endAdornment: <InputAdornment position='end'>{currencies.find((currency) => currency.id == getValues(`prices.${index}.currency_id`))?.abbreviation}</InputAdornment>
                              }}
                            />
                            )}
                          />
                          {errors.prices?.[index]?.amount && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.prices?.[index]?.amount?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('delete')}>
                          <Button variant='outlined' color='error' onClick={() => priceRemove(index)}><DeleteOutlineIcon /></Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}
                  {/*
                    END PRODUCT PRICES
                  */}
                </TabPanel>
                <TabPanel value='variants'>
                  {/*
                    START PRODUCT VARIANTS
                  */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <Controller
                      name='variants'
                      control={control}
                      render={({ field: { value } }) => (
                        <Autocomplete
                          multiple
                          options={variants}
                          filterSelectedOptions
                          getOptionLabel={option => option.name}
                          onChange={handleVariationChange}
                          value={value}
                          renderInput={params => <TextField {...params} label={t('variants')} sx={{ mb: 3 }} />}
                        />
                      )}
                    />
                    {errors.variants && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.variants.message}`)}</FormHelperText>}
                  </FormControl>
                  
                  <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('variants')}</Typography>
                  {detailFields.map((item, index) => (
                    <Grid container spacing={3} sx={{ mb: 3 }} key={uuid()}>
                      {item.variants.map((selectedOption, variantIndex) => {
                        const variant = variants.find((variant) => !!variant.options.find((option) => option.id == selectedOption.option_id));
                        return (
                          <Grid item xs key={uuid()}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name={`details.${index}.variants.${variantIndex}.option_id`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    disableClearable
                                    size='small'
                                    id={`select-variant-${index}`}
                                    options={variant!.options}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label={variant?.name} />}
                                    onChange={(_, data) => {onChange(data?.id)}}
                                    value={variant!.options.find(option => option.id == value)}
                                  />
                                )}
                              />
                              {errors.details?.[index]?.variants?.[variantIndex]?.option_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.details?.[index]?.variants?.[variantIndex]?.option_id}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>
                        )})}
                      <Grid item xs={12} lg={4}>
                        <FormControl fullWidth>
                          <Controller
                            name={`details.${index}.codes`}
                            control={control}
                            render={({ field: { value } }) => (
                              <Autocomplete
                                freeSolo
                                autoSelect
                                multiple
                                size='small'
                                options={[]}
                                value={value}
                                onChange={(event, newValue) => {setValue(`details.${index}.codes`, newValue as string[])}}
                                renderInput={params => <TextField {...params} label={t('code')} />}
                              />
                            )}
                          />
                          {errors.details?.[index]?.codes && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.details?.[index]?.codes?.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('prices')}>
                          <Button variant='outlined' color='success' onClick={() => handleDetailPriceEditClick(index)}><CashMultipleIcon/></Button>
                        </Tooltip>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('multimedia')}>
                          <Button variant='outlined' color='primary' onClick={() => {}}><ImageTextIcon/></Button>
                        </Tooltip>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('delete')}>
                          <Button variant='outlined' color='error' onClick={() => detailRemove(index)}><DeleteOutlineIcon/></Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}
                  {/*
                    END PRODUCT VARIANTS
                  */}
                </TabPanel>
              </Box>
            </TabContext>
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

      {openPriceAddEditDialog &&
        <ProductPriceAddEditDialog
          open={openPriceAddEditDialog}
          loading={false}
          defaultFormValues={selectedDetailPrices}
          onSubmit={handlePriceEditSubmit}
          onClose={() => setOpenPriceAddEditDialog(false)}
        />
      }
    </>
  );
};

export default ProductAddDialog;
