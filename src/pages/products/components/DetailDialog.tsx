// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { MProperty } from 'src/models/product/property';

// ** MUI Imports
import { Dialog, DialogContent, FormControl, DialogTitle, Box, Typography, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme, InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from 'src/components/mui/Tab';

// ** Icons Imports
import PlusIcon from 'mdi-material-ui/Plus';
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import CloseIcon from 'mdi-material-ui/Close';
import ImageTextIcon from 'mdi-material-ui/ImageText';
import FileDocumentOutlineIcon from 'mdi-material-ui/FileDocumentOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';
import WarehouseIcon from 'mdi-material-ui/Warehouse';
import CashMultipleIcon  from 'mdi-material-ui/CashMultiple';
import DeleteOutlineIcon  from 'mdi-material-ui/DeleteOutline';
import CashIcon  from 'mdi-material-ui/Cash';
import LanIcon  from 'mdi-material-ui/Lan';
import InformationOutlineIcon  from 'mdi-material-ui/InformationOutline';

// ** Third Party Imports
import { t } from 'i18next';
import { formatDate, formatNumber } from 'src/utils/format';
import { MProductProperty } from 'src/models/product/productProperty';
import { MProductDetailPrice } from 'src/models/product/detailPrice';
import { MProductDetailCost } from 'src/models/product/detailCost';
import { MProductDetail } from 'src/models/product/detail';
import CurrencyInput from 'src/components/inputmask/CurrencyInput';
import PercentageInput from 'src/components/inputmask/PercentageInput';

// ** Third Party Imports

/**
 * Component props
 */
interface IProps {
  open: boolean;
  onDetailInformationClick: (productDetail: MProductDetail) => void; 
  onEditClick: () => void;
  onPriceAddClick: () => void;
  onPriceEditClick: (price: MProductDetailPrice) => void;
  onPriceDeleteClick: (price: MProductDetailPrice) => void;
  onCostAddClick: () => void;
  onCostEditClick: (price: MProductDetailCost) => void;
  onCostDeleteClick: (price: MProductDetailCost) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

// ** Property value input render
interface IPropertyValueInput {
  productProperty: MProductProperty;
  index: number;
}

/**
 * Product edit dialog
 * @param props component parameters
 * @returns Product Edit Dialog component
 */
const ProductDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onDetailInformationClick, onEditClick, onPriceAddClick, onPriceEditClick, onPriceDeleteClick, onCostAddClick, onCostEditClick, onCostDeleteClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { productReducer: { currentProduct, currentProductDetail }, measurementUnitReducer: { measurementUnits }, currencyReducer: { currencies }, propertyReducer: { properties } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');
  const propertyOptions = properties.map(property => property.options).flat();

  const PropertyValueInput: React.FC<IPropertyValueInput> = ({productProperty, index}) => {
    const property = properties.find(property => property.id == productProperty.propertyId)!;
    switch (property.type) {
      case 'numeric':
        return (
          <TextField
            value={productProperty.value}
            type='numeric'
            label={t('value')}
            size='small'
            inputProps={{
              sx: { textAlign: 'right'}
            }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>{measurementUnits.find((measurementUnits) => measurementUnits.id == property.measurementUnitId)?.abbreviation}</InputAdornment>
            }}
          />
        );
      case 'string':
      case 'list':
        return (
          <Autocomplete
            multiple={productProperty.value instanceof Array}
            freeSolo
            disableClearable
            readOnly
            size='small'
            options={[]}
            value={productProperty.value}
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
          {currentProductDetail?.codes.length ? t('product_detail_data') : t('product_data')}
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/*
            START ACTION BUTTONS
          */}
          <Box sx={{ display: 'flex', justifyContent: 'right', mb: 6 }}>
            <Box sx={{ display: {xs: 'none', md: 'inline-flex'}}}>
              <Button sx={{ mr: 2 }} onClick={onEditClick} variant='outlined' color='primary' startIcon={<PencilIcon fontSize='small' />}>
                {t('edit')}
              </Button>
              <Button sx={{ mr: 2 }} onClick={onDeleteClick} variant='outlined' color='error' startIcon={<DeleteIcon fontSize='small' />}>
                {t('delete')}
              </Button>
            </Box>
            <Box sx={{ display: {xs: 'inline-flex', md: 'none'} }}>
              <Button sx={{ mr: 2 }} onClick={onEditClick} color='primary' variant='outlined'><PencilIcon fontSize='small'/></Button>
              <Button sx={{ mr: 2 }} onClick={onDeleteClick} color='error' variant='outlined'><DeleteIcon fontSize='small'/></Button>
            </Box>
          </Box>
          {/*
            END ACTION BUTTONS
          */}
          <TabContext value={tabValue}>
            <TabList
              onChange={handleTabChange}
            >
              <Tab value='definition' label={t('definition')} icon={<FileDocumentOutlineIcon />} />
              {!!currentProductDetail && <Tab value='prices' label={t('prices')} icon={<CashMultipleIcon />} />}
              {!!currentProductDetail && <Tab value='inventory' label={t('inventory')} icon={<WarehouseIcon />} />}
              {!currentProductDetail && <Tab value='variants' label={t('variants')} icon={<LanIcon />} />}
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
                      <Autocomplete
                        freeSolo
                        autoSelect
                        multiple
                        readOnly
                        options={[]}
                        defaultValue={currentProductDetail?.codes.length ? currentProductDetail?.codes : currentProduct?.codes}
                        renderInput={params => <TextField {...params} label={t('code')} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={7}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <TextField
                        value={currentProductDetail?.name ?? currentProduct?.name}
                        label={t('name')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={2}>
                    <FormControlLabel
                      label='Activo'
                      control={<Checkbox checked={Boolean(currentProduct?.status)} />}
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={3}>
                  <Grid item xs>
                    <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('categorization')}</Typography>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='type-select'>{t('type')}</InputLabel>
                      <Select
                        fullWidth
                        readOnly
                        id='select-type'
                        label={t('type')}
                        labelId='type-select'
                        defaultValue={currentProduct?.type.id}
                      >
                        <MenuItem value={currentProduct?.type.id}>{currentProduct?.type.name}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='measurement-unit-select'>{t('measurement_unit')}</InputLabel>
                      <Select
                        fullWidth
                        readOnly
                        id='select-measurement-unit'
                        label={t('measurement_unit')}
                        labelId='measurement-unit-select'
                        defaultValue={currentProduct?.measurementUnit.id}
                      >
                        <MenuItem value={currentProduct?.measurementUnit.id}>{currentProduct?.measurementUnit.name}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='category-select'>{t('category')}</InputLabel>
                      <Select
                        fullWidth
                        readOnly
                        id='select-category'
                        label={t('category')}
                        labelId='category-select'
                        defaultValue={currentProduct?.category.id}
                      >
                        <MenuItem value={currentProduct?.category.id}>{currentProduct?.category.name}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='subcategory-select'>{t('subcategory')}</InputLabel>
                      <Select
                        fullWidth
                        readOnly
                        id='select-subcategory'
                        label={t('subcategory')}
                        labelId='subcategory-select'
                        defaultValue={currentProduct?.subcategory.id}
                      >
                        <MenuItem value={currentProduct?.subcategory.id}>{currentProduct?.subcategory.name}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='brand-select'>{t('brand')}</InputLabel>
                      <Select
                        fullWidth
                        readOnly
                        id='select-brand'
                        label={t('brand')}
                        labelId='brand-select'
                        defaultValue={currentProduct?.brand.id}
                      >
                        <MenuItem value={currentProduct?.brand.id}>{currentProduct?.brand.name}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={8}>
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                      <Grid item xs={12} lg={4}>
                        <FormControlLabel
                          label={t('taxed')}
                          control={<Checkbox checked={Boolean(currentProduct?.taxed)} />}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                          <PercentageInput
                            value={currentProduct?.tax}
                            label={t('tax')}
                            size='small'
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                          <PercentageInput
                            value={currentProduct?.percentageTaxed}
                            label={t('percentage_taxed')}
                            size='small'
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    
                    <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('properties')}</Typography>

                    {currentProduct?.properties?.map((property, index) => (
                      <Grid container spacing={3} sx={{ mb: 3}} key={`prices.${index}`}>
                        <Grid item xs={12} lg={5} sx={{ mb: 3}}>
                          <FormControl fullWidth size='small'>
                            <Autocomplete
                              disableClearable
                              readOnly
                              size='small'
                              options={[property.name]}
                              value={property.name}
                              renderInput={params => <TextField {...params} label={property.name} />}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs sx={{ mb: 3}}>
                          <FormControl fullWidth>
                            <PropertyValueInput productProperty={property} index={index}/>
                          </FormControl>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <FormControl fullWidth sx={{ mb: 6 }}>
                  <TextField
                    defaultValue={currentProduct?.description}
                    multiline
                    rows={4}
                    label={t('description')}
                  />
                </FormControl>
                
                {/*
                  END PRODUCT DEFINITION
                */}
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='prices'>
                {/*
                  START PRODUCT PRICES
                */}
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                  <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                      <Button sx={{ mr: 2 }} onClick={onCostAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                        {t('add')}
                      </Button>
                  </Box>
                  <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                      <Button sx={{ mr: 2 }} onClick={onCostAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                  </Box>
                </Box>

                <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('costs')}</Typography>

                {currentProductDetail?.costs.map((cost, index) => (
                  <Grid container spacing={3} sx={{ mb: 3}} key={`costs.${index}`}>
                    <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <InputLabel id='type-select'>{t('list')}</InputLabel>
                        <Select
                          fullWidth
                          readOnly
                          id='select-cost-type'
                          label={t('list')}
                          labelId='cost-type-select'
                          defaultValue={cost.type.id}
                        >
                          <MenuItem value={cost.type.id}>{cost.type.name}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <InputLabel id='currency-select'>{t('currency')}</InputLabel>
                        <Select
                          fullWidth
                          readOnly
                          id='select-currency'
                          label={t('currency')}
                          labelId='currency-select'
                          defaultValue={cost.currency.id}
                        >
                          <MenuItem value={cost.currency.id}>{cost.currency.name}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <CurrencyInput
                          value={cost.amount}
                          label={t('amount')}
                          currency={currencies.find(currency => currency.id == cost.currency.id)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                      <Tooltip title={t('edit_cost')}>
                        <Button variant='outlined' color='success' onClick={() => onCostEditClick(cost)}><CashIcon fontSize='small' /></Button>
                      </Tooltip>
                    </Grid>
                    <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                      <Tooltip title={t('delete_cost')}>
                        <Button variant='outlined' color='error' onClick={() => onCostDeleteClick(cost)}><DeleteOutlineIcon fontSize='small' /></Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                  <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                      <Button sx={{ mr: 2 }} onClick={onPriceAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                        {t('add')}
                      </Button>
                  </Box>
                  <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                      <Button sx={{ mr: 2 }} onClick={onPriceAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                  </Box>
                </Box>

                <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('prices')}</Typography>

                {currentProductDetail?.prices.map((price, index) => (
                  <Grid container spacing={3} sx={{ mb: 3}} key={`prices.${index}`}>
                    <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <InputLabel id='type-select'>{t('list')}</InputLabel>
                        <Select
                          fullWidth
                          readOnly
                          id='select-price-type'
                          label={t('list')}
                          labelId='price-type-select'
                          defaultValue={price.type.id}
                        >
                          <MenuItem value={price.type.id}>{price.type.name}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={3} sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <InputLabel id='currency-select'>{t('currency')}</InputLabel>
                        <Select
                          fullWidth
                          readOnly
                          id='select-currency'
                          label={t('currency')}
                          labelId='currency-select'
                          defaultValue={price.currency.id}
                        >
                          <MenuItem value={price.currency.id}>{price.currency.name}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs sx={{ mb: 3}}>
                      <FormControl fullWidth>
                        <CurrencyInput
                          value={price.amount}
                          label={t('amount')}
                          currency={currencies.find(currency => currency.id == price.currency.id)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                      <Tooltip title={t('edit_price')}>
                        <Button variant='outlined' color='success' onClick={() => onPriceEditClick(price)}><CashIcon fontSize='small' /></Button>
                      </Tooltip>
                    </Grid>
                    <Grid item alignItems="stretch" sx={{ display: "flex", mb: 3 }}>
                      <Tooltip title={t('delete_price')}>
                        <Button variant='outlined' color='error' onClick={() => onPriceDeleteClick(price)}><DeleteOutlineIcon fontSize='small' /></Button>
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
                  {/* <FormControl fullWidth sx={{ mb: 3 }}>
                    <Autocomplete
                      multiple
                      options={currentProduct?.variants}
                      filterSelectedOptions
                      getOptionLabel={option => option.name}
                      defaultValue={currentProduct?.variants}
                      renderInput={params => <TextField {...params} label='Variantes del producto' sx={{ mb: 3 }} />}
                    />
                  </FormControl> */}
                  
                  <Typography variant='h6' sx={{ mb: 3, ml: 3}}>{t('variants')}</Typography>
                  {currentProduct?.details?.map((detail, index) => (
                    <Grid container spacing={3} sx={{ mb: 3 }} key={`detail.${index}`}>
                      {detail.variants.map((variant, variantIndex) => {
                        return (
                          <Grid item xs key={`variant.${variantIndex}`}>
                            <FormControl fullWidth size='small'>
                              <InputLabel id='variant-select'>{variant.name}</InputLabel>
                              <Select
                                fullWidth
                                id='select-variant'
                                label={variant.name}
                                labelId='variant-select'
                                defaultValue={variant.option.id}
                              >
                                <MenuItem value={variant.option.id}>{variant.option.name}</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        )})}
                      <Grid item xs={12} lg={4}>
                        <FormControl fullWidth>
                          <Autocomplete
                            freeSolo
                            readOnly
                            autoSelect
                            multiple
                            size='small'
                            options={detail.codes}
                            value={detail.codes}
                            renderInput={params => <TextField {...params} label={t('code')} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item alignItems="stretch" sx={{ display: "flex" }}>
                        <Tooltip title={t('info')}>
                          <Button variant='outlined' color='primary' onClick={() => onDetailInformationClick(detail)}><InformationOutlineIcon/></Button>
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
      </Dialog>
    </>
  );
};

export default ProductDetailDialog;
