// ** React Imports
import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddSaleOrder } from 'src/interfaces/sale-order/add';
import { formatMoney } from 'src/utils/format';
import { MProductDetail } from 'src/models/product/detail';
import { MProductDetailPrice } from 'src/models/product/detailPrice';
import { MCurrency } from 'src/models/currency';

// ** MUI Imports
import { DataGridPro } from '@mui/x-data-grid-pro';
import { GridColDef, GridValueGetterParams, GridRenderCellParams, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, FormControl, FormHelperText, Typography, styled, Grid, InputLabel, Select, MenuItem, InputAdornment, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers-pro';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import ContentSaveIcon from 'mdi-material-ui/ContentSave';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';

// ** Third Party Imports
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';
import DecimalPercentageInput from 'src/components/inputmask/DecimalPercentageInput';
import NumericInput from 'src/components/inputmask/NumericInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddSaleOrder) => void;
  onClose: () => void;
}

/**
 * SaleOrder product type to display in datagrid
 */
type AddSaleOrderProductType = {
  index: number;
  id: number;
  productDetail: MProductDetail;
  productDetailPrice: MProductDetailPrice;
  quantity: number;
  discount: number;
};

/**
 * SaleOrder totals type to display
 */
type AddSaleOrderTotalsType = {
  currency: MCurrency,
  subtotal: number,
  discount: number,
  total: number
};

/**
 * SaleOrder edit dialog
 * @param props component parameters
 * @returns SaleOrder Edit Dialog component
 */
const SaleOrderAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleOrderReducer: { currentSaleOrder }, customerReducer: { customers }, productReducer: { products, productDetails }, establishmentReducer: { establishments }, warehouseReducer: { warehouses }, measurementUnitReducer: { measurementUnits }, paymentTermReducer: { paymentTerms }, currencyReducer: { currencies }, userReducer: { users } } = useAppSelector((state) => state);
  // ** Vars
  const [selectedProductCode, setSelectedProductCode] = useState<string>('');
  const [selectedProductByDescription, setSelectedProductByDescription] = useState<MProductDetail | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<AddSaleOrderProductType[]>([]);
  const [saleOrderTotals, setSaleOrderTotals] = useState<AddSaleOrderTotalsType>({currency: currencies[0], subtotal: 0, discount: 0, total: 0});

  const pointsOrSale = establishments.map(establishment => establishment.pointsOfSale).flat();

  const defaultValues: IAddSaleOrder = {
    customer_id: currentSaleOrder?.customerId ?? 1,
    currency_id: currentSaleOrder?.currencyId ?? 1,
    establishment_id: currentSaleOrder?.establishment.id ?? 1,
    point_of_sale_id: currentSaleOrder?.pointOfSaleId ?? 1,
    warehouse_id: currentSaleOrder?.warehouseId ?? 1,
    seller_id: currentSaleOrder?.sellerId ?? 1,
    ordered_at: dayjs(currentSaleOrder?.orderedAt) ?? dayjs(),
    expires_at: currentSaleOrder?.expiresAt ? dayjs(currentSaleOrder?.expiresAt) : null,
    comments: currentSaleOrder?.comments ?? '',
    products: currentSaleOrder?.products.map(product => ({
      id: product.id,
      product_detail_price_id: product.price.id,
      measurement_unit_id: product.measurementUnitId,
      quantity: product.quantity,
      discount: product.discount,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.productDetail.product.percentageTaxed

    })) ?? []
  };

  /**
   * DataGrid Columns definition products
   */
  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 130,
      field: 'code',
      headerName: String(t('code')),
      valueGetter: ({ row }: GridValueGetterParams) => row.productDetail.codes[0] ?? row.productDetail.product.codes[0]
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'name',
      headerName: String(t('name')),
      valueGetter: ({ row }: GridValueGetterParams) => row.productDetail.name
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'price',
      headerName: String(t('price')),
      renderCell: ({ row }: GridRenderCellParams) => {
        return <Select
          fullWidth
          size='small'
          id='select-price'
          onChange={(e) => handleProductPriceChange(row.index, Number(e.target.value))}
          value={row.productDetailPrice.id}
          renderValue={(value) => formatMoney(row.productDetailPrice.amount, row.productDetailPrice.currency)}
        >
          {row.productDetail.prices.map((price: MProductDetailPrice) => (
            <MenuItem key={price.id} value={price.id}>{`${price.type.name}: ${formatMoney(price.amount, price.currency)}`}</MenuItem>
          ))}
        </Select>;
      }
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'quantity',
      headerName: String(t('quantity')),
      renderCell: ({ row }: GridRenderCellParams) => {
        console.log(row)
        return <NumericInput
          size='small'
          value={row.quantity}
          measurementUnit={row.productDetail.product.measurementUnit}
          onChange={(e) => handleProductQuantityChange(row.index, Number(e.target.value))}
        />;
      }
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'discount',
      headerName: String(t('discount')),
      renderCell: ({ row }: GridRenderCellParams) => {
        return <DecimalPercentageInput
          size='small'
          value={row.discount}
          onChange={(e) => handleProductDiscountChange(row.index, Number(e.target.value))}
        />;
      }
    },
    // {
    //   flex: 0.15,
    //   minWidth: 130,
    //   field: 'total',
    //   headerName: String(t('total')),
    //   renderCell: ({ row }: GridRenderCellParams) => {
    //     return <TextField
    //       size='small'
    //       value={row.productDetailPrice.amount * row.quantity - row.productDetailPrice.amount * row.quantity * row.discount}
    //       onChange={(e) => handleProductTotalChange(row.index, Number(e.target.value))}
    //       inputProps={{
    //         sx: { textAlign: 'right'}
    //       }}
    //       InputProps={{
    //         endAdornment: <InputAdornment position='end'>{row.productDetailPrice.currency.abbreviation}</InputAdornment>,
    //         inputComponent: CurrencyFormat as any
    //       }}
    //     />;
    //   }
    // },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'total',
      headerName: String(t('total')),
      renderCell: ({ row }: GridRenderCellParams) => {
        return <Typography sx={{ width: '100%', textAlign: 'right' }}>{formatMoney((row.productDetailPrice.amount * row.quantity - row.productDetailPrice.amount * row.quantity * row.discount), row.productDetailPrice.currency)}</Typography>;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('information')}><InformationOutlineIcon /></Tooltip>} onClick={() => {}} label={t('information')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => productRemove(row.index)} label={t('delete')} />
      ]
    }
  ];

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    customer_id: yup.number().required(),
    establishment_id: yup.number().required(),
    point_of_sale_id: yup.number().required(),
    warehouse_id: yup.number().required(),
    seller_id: yup.number().required(),
    ordered_at: yup.string().required(),
    expires_at: yup.string().nullable(),
    comments: yup.string().nullable()
  });

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm<IAddSaleOrder>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  let watchCurrency = watch('currency_id');
  let watchEstablishment = watch('establishment_id');

  const {
    fields: productFields,
    append: productAppend,
    update: productUpdate,
    remove: productRemove
  } = useFieldArray({
    control,
    name: "products",
    keyName: "key"
  });

  useEffect(() => {
    if (selectedProductByDescription) {
      handleProductSelect();
    }
  }, [selectedProductByDescription]);

  useEffect(() => {
    getSelectedProducts();
  }, [productFields]);

  useEffect(() => {
    const newDefaultPointOfSale = establishments.find(establishment => establishment.id === watchEstablishment && establishment.id === defaultValues.establishment_id) ?? establishments.find(establishment => establishment.id === watchEstablishment);
    setValue('point_of_sale_id', newDefaultPointOfSale!.id);
  }, [watchEstablishment]);

  /**
   * Get the selected services
   */
  const getSelectedProducts = () => {
    let saleOrderTotals: AddSaleOrderTotalsType = {
      currency: currencies.find(currency => currency.id == watchCurrency)!,
      subtotal: 0,
      discount: 0,
      total: 0
    };
    const selectedProducts = productFields.map((selectedProduct, index) => {
      const productDetailPrice = productDetails.map(productDetail => productDetail.prices.find(productDetailPrice => productDetailPrice.id == selectedProduct.product_detail_price_id)).filter(product => product)[0];
      const productDetail = productDetails.find(productDetail => productDetail.id == productDetailPrice?.productDetailId);

      saleOrderTotals.subtotal += productDetailPrice!.amount * selectedProduct.quantity;
      saleOrderTotals.discount += productDetailPrice!.amount * selectedProduct.quantity * selectedProduct.discount;
      saleOrderTotals.total = saleOrderTotals.subtotal - saleOrderTotals.discount;
      return {
        index: index,
        id: productDetail!.id,
        productDetail: productDetail!,
        productDetailPrice: productDetailPrice!,
        quantity: selectedProduct.quantity,
        discount: selectedProduct.discount
      };
    });
    setSelectedProducts(selectedProducts);
    setSaleOrderTotals(saleOrderTotals);
  };

  /**
   * Product select change event handler
   */
  const handleProductSelect = () => {
    console.log(selectedProductByDescription);
    const productDetailPriceId = selectedProductByDescription!.prices[0].id;
    const index = productFields.map(productField => productField.product_detail_price_id).indexOf(productDetailPriceId);
    if (index == -1) {
      const product = selectedProductByDescription!;
      productAppend({
        id: null,
        product_detail_price_id: productDetailPriceId,
        measurement_unit_id: product.product.measurementUnitId,
        quantity: 1,
        discount: 0,
        code: product.codes[0] ?? product.product.codes[0],
        name: product.name,
        taxed: product.product.taxed,
        tax: product.product.tax,
        percentage_taxed: product.product.percentageTaxed
      });      
    } else {
      const product = productFields[index];
      productUpdate(index, {
        id: product.id,
        product_detail_price_id: productDetailPriceId,
        measurement_unit_id: product.measurement_unit_id,
        quantity: product.quantity + 1,
        discount: product.discount,
        code: product.code,
        name: product.name,
        taxed: product.taxed,
        tax: product.tax,
        percentage_taxed: product.percentage_taxed
      });
    }
    setSelectedProductByDescription(null);
  };

  /**
   * Product select change event handler
   */
  const handleCodeSelect = () => {
    const code = selectedProductCode;
    console.log(code);
    const selectedProductDetail = products.find((product) => product.codes.includes(code))?.details?.[0] ?? productDetails.find((productDetail) => productDetail.codes.includes(code));
    if (!selectedProductDetail) {
      setSelectedProductCode('');
      toast.error(t('product_not_found'));
      return;
    }
    const productDetailPriceId = selectedProductDetail.prices[0].id;
    const index = productFields.map(productField => productField.product_detail_price_id).indexOf(productDetailPriceId);
    if (index == -1) {
      const product = selectedProductDetail;
      productAppend({
        id: null,
        product_detail_price_id: productDetailPriceId,
        measurement_unit_id: product.product.measurementUnitId,
        quantity: 1,
        discount: 0,
        code: product.codes[0] ?? product.product.codes[0],
        name: product.name,
        taxed: product.product.taxed,
        tax: product.product.tax,
        percentage_taxed: product.product.percentageTaxed
      });      
    } else {
      const product = productFields[index];
      productUpdate(index, {
        id: product.id,
        product_detail_price_id: productDetailPriceId,
        measurement_unit_id: product.measurement_unit_id,
        quantity: product.quantity + 1,
        discount: product.discount,
        code: product.code,
        name: product.name,
        taxed: product.taxed,
        tax: product.tax,
        percentage_taxed: product.percentage_taxed
      });
    }
    setSelectedProductCode('');
  };

  /**
   * Product price change event handler
   * @param index index of product array
   * @param quantity new quantity
   */
  const handleProductPriceChange = (index: number, detailPriceId: number) => {
    const product = productFields[index];
    productUpdate(index, {
      id: product.id,
      product_detail_price_id: detailPriceId,
      measurement_unit_id: product.measurement_unit_id,
      quantity: product.quantity,
      discount: product.discount,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.percentage_taxed
    });
  };

  /**
   * Product quantity change event handler
   * @param index index of product array
   * @param quantity new quantity
   */
  const handleProductQuantityChange = (index: number, quantity: number) => {
    const product = productFields[index];
    productUpdate(index, {
      id: product.id,
      product_detail_price_id: product.product_detail_price_id,
      measurement_unit_id: product.measurement_unit_id,
      quantity: quantity,
      discount: product.discount,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.percentage_taxed
    });
  };

  /**
   * Product discount change event handler
   * @param index index of product array
   * @param discount new discount
   */
  const handleProductDiscountChange = (index: number, discount: number) => {
    console.log(discount);
    const product = productFields[index];
    productUpdate(index, {
      id: product.id,
      product_detail_price_id: product.product_detail_price_id,
      measurement_unit_id: product.measurement_unit_id,
      quantity: product.quantity,
      discount: discount,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.percentage_taxed
    });
  };

  /**
   * Product total change event handler
   * @param index index of product array
   * @param discount new discount
   */
  const handleProductTotalChange = (index: number, total: number) => {
    const product = productFields[index];
    const price = productDetails.find(productDetail => !productDetail.prices.find(productDetailPrice => productDetailPrice.id == product.product_detail_price_id))!.prices.find(productDetailPrice => productDetailPrice.id == product.product_detail_price_id)!.amount;
    productUpdate(index, {
      id: product.id,
      product_detail_price_id: product.product_detail_price_id,
      measurement_unit_id: product.measurement_unit_id,
      quantity: product.quantity,
      discount: (product.quantity * price - total) / product.quantity * price,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.percentage_taxed
    });
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
        fullScreen
        open={open}
        maxWidth='xl'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogContent sx={{ height: '100%' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
            <Grid container sx={{ minHeight: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
              <Grid item sx={{ position: 'relative', mb: 6, fontSize: '1.25rem' }}>
                {t('add_sale_order')}
                <IconButton
                  size='small'
                  onClick={handleClose}
                  sx={{ position: 'absolute', right: 0, top: 0 }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Grid container sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'stretch' }}>
                  <Grid item>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <Controller
                            name='ordered_at'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                label={t('date')}
                                value={value}
                                format='DD-MM-YYYY'
                                onChange={onChange}
                                slotProps={{ textField: {  } }}
                              />
                            )}
                          />
                          {errors.ordered_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.ordered_at.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <FormControl fullWidth>
                          <Controller
                            name='customer_id'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                openOnFocus
                                disableClearable
                                blurOnSelect
                                options={customers}
                                getOptionLabel={option => `${option.identificationDocument} - ${option.name}`}
                                onChange={(event, newValue) => {onChange(newValue.id)}}
                                value={customers.find(customer => customer.id == value)!}
                                renderInput={params => <TextField {...params} label={t('customer')} />}
                              />
                            )}
                          />
                          {errors.customer_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.customer_id.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='currency_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={currencies}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={currencies.find(currency => currency.id == value)!}
                                    renderInput={params => <TextField {...params} label={t('currency')} size='small' />}
                                  />
                                )}
                              />
                              {errors.currency_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.currency_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='seller_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={users}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={users.find(user => user.id == value)!}
                                    renderInput={params => <TextField {...params} label={t('seller')} size='small' />}
                                  />
                                )}
                              />
                              {errors.seller_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.seller_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='establishment_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={establishments}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={establishments.find(establishment => establishment.id == value)!}
                                    renderInput={params => <TextField {...params} label={t('establishment')} size='small' />}
                                  />
                                )}
                              />
                              {errors.establishment_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.establishment_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='point_of_sale_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={pointsOrSale.filter(pointsOrSale => pointsOrSale.establishmentId == watchEstablishment)}
                                    getOptionLabel={option => String(option.number)}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={pointsOrSale.find(pointOfSaleOrder => pointOfSaleOrder.id == value)}
                                    renderInput={params => <TextField {...params} label={t('point_of_sale')} size='small' />}
                                  />
                                )}
                              />
                              {errors.point_of_sale_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.point_of_sale_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='warehouse_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={warehouses}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={warehouses.find(warehouse => warehouse.id == value)!}
                                    renderInput={params => <TextField {...params} label={t('warehouse')} size='small' />}
                                  />
                                )}
                              />
                              {errors.warehouse_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.warehouse_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs>
                            <FormControl fullWidth>
                              <Controller
                                name='expires_at'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <DatePicker
                                    label={t('expires_at')}
                                    value={value}
                                    format='DD-MM-YYYY'
                                    onChange={onChange}
                                    slotProps={{ textField: { size: 'small' } }}
                                  />
                                )}
                              />
                              {errors.expires_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.expires_at.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <TextField
                              label={t('code')}
                              value={selectedProductCode}
                              onChange={(e) => setSelectedProductCode(e.target.value)}
                              onKeyDown={(e) => {if(e.key == 'Enter'){e.preventDefault();handleCodeSelect();}}}
                            />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <FormControl fullWidth>
                          <Autocomplete
                            openOnFocus
                            blurOnSelect
                            options={productDetails}
                            value={selectedProductByDescription}
                            getOptionLabel={option => option.name}
                            onChange={(e, newValue) => setSelectedProductByDescription(newValue)}
                            isOptionEqualToValue={(option, newValue) => {
                              return option.id === newValue.id;
                            }}
                            renderOption={(props, option) => (
                              <MenuItem {...props}>
                                <Grid container>
                                  <Grid item xs={12} md={4}><Typography variant='h6'>{option.codes[0] ?? option.product.codes[0]}</Typography></Grid>
                                  <Grid item xs={12} md={8}><Typography variant='h6'>{option.name}</Typography></Grid>
                                  <Grid item xs={12} md={5}>{`${t('category')}: ${option.product.category.name} / ${option.product.subcategory.name}`}</Grid>
                                  <Grid item xs={12} md={3}>{`${t('brand')}: ${option.product.brand.name}`}</Grid>
                                  <Grid item xs={12} md={2}>{`${t('price')}: ${formatMoney(option.prices[0].amount, option.prices[0].currency)}`}</Grid>
                                  <Grid item xs={12} md={2}>{`${t('stock')}: ${option.stock[0] ? option.stock[0].stock : 0}`}</Grid>
                                </Grid>
                              </MenuItem>
                            )}
                            renderInput={params => <TextField {...params} label={t('search_product')} sx={{ mb: 3 }} />}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    {/*
                      START PRODUCTS
                    */}
                    <DataGridPro
                      columns={columns} 
                      rows={selectedProducts} 
                      localeText={setDataGridLocale()}
                      disableColumnMenu={true}
                      hideFooterRowCount
                      hideFooterSelectedRowCount
                      disableRowSelectionOnClick
                      sx={{ minHeight: 250, height: '48vh' }}
                    />
                    {/*
                      END PRODUCTS
                    */}
                  </Grid>

                  <Grid item>
                    <Grid container>
                      <Grid item xs={12} md={6}></Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container sx={{ pr: 12 }}>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('subtotal')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleOrderTotals.subtotal, saleOrderTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('discount')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleOrderTotals.discount, saleOrderTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{t('total')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleOrderTotals.total, saleOrderTotals.currency)}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ display: 'flex', position: 'sticky', bottom: 0, left: 0, pt: 9 }}>
                <Button variant='outlined' color='error' sx={{ mr: 3, height: 50, textTransform: 'capitalize' }} onClick={() => reset()}>
                  <CloseIcon /> {t('reset')}
                </Button>
                <LoadingButton type='submit' variant='contained' sx={{ height: 50, textTransform: 'capitalize' }} loading={loading} fullWidth>
                  <ContentSaveIcon /> {t('finalize_sale_order')}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaleOrderAddDialog;
