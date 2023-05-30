// ** React Imports
import { SyntheticEvent, forwardRef, useEffect, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateSale } from 'src/interfaces/sale/addUpdate';
import { formatMoney } from 'src/utils/format';
import { MProductDetail } from 'src/models/product/detail';
import { MProductDetailPrice } from 'src/models/product/detailPrice';
import { MCurrency } from 'src/models/currency';
import { IUpdateSaleInstalment } from 'src/interfaces/sale/updateInstalment';

// ** MUI Imports
import { DataGridPro } from '@mui/x-data-grid-pro';
import { GridColDef, GridValueGetterParams, GridRenderCellParams, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, DialogActions, FormControl, FormControlLabel, FormHelperText, DialogTitle, Box, Typography, styled, Grid, InputLabel, Select, MenuItem, InputAdornment, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, Checkbox, TextField } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers-pro';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import ContentSaveIcon from 'mdi-material-ui/ContentSave';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import CalendarOutlineIcon from 'mdi-material-ui/CalendarOutline';
import CashMultipleIcon from 'mdi-material-ui/CashMultiple';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';

// ** Third Party Imports
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray, ControllerRenderProps } from 'react-hook-form';
import SaleInstalmentEditDialog from './InstalmentsEditDialog';
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';
import SalePaymentsAddEditDialog from './PaymentsEditDialog';
import { IAddUpdateSalePayment } from 'src/interfaces/sale/addUpdatePayment';
import DecimalPercentageInput from 'src/components/inputmask/DecimalPercentageInput';
import NumericInput from 'src/components/inputmask/NumericInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddUpdateSale) => void;
  onClose: () => void;
}

/**
 * Sale product type to display in datagrid
 */
type AddSaleProductType = {
  index: number;
  id: number;
  productDetail: MProductDetail;
  productDetailPrice: MProductDetailPrice;
  quantity: number;
  discount: number;
};

/**
 * Sale totals type to display
 */
type AddSaleTotalsType = {
  currency: MCurrency,
  subtotal: number,
  discount: number,
  total: number
};

/**
 * Sale edit dialog
 * @param props component parameters
 * @returns Sale Edit Dialog component
 */
const SaleAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleReducer: { currentSale }, customerReducer: { customers }, productReducer: { products, productDetails }, establishmentReducer: { establishments }, warehouseReducer: { warehouses }, measurementUnitReducer: { measurementUnits }, paymentTermReducer: { paymentTerms }, currencyReducer: { currencies }, userReducer: { users } } = useAppSelector((state) => state);
  // ** Vars
  const [mountedProducts, setMountedProducts] = useState<boolean>(false);
  const [mountedPaymentTerm, setMountedPaymentTerm] = useState<boolean>(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string>('');
  const [selectedProductByDescription, setSelectedProductByDescription] = useState<MProductDetail | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<AddSaleProductType[]>([]);
  const [saleTotals, setSaleTotals] = useState<AddSaleTotalsType>({currency: currencies[0], subtotal: 0, discount: 0, total: 0});
  const [showPaymentsButton, setShowPaymentsButton] = useState<boolean>(true);
  const [showExpiresAtField, setShowExpiresAtField] = useState<boolean>(false);
  const [showInstalmentsButton, setShowInstalmentsButton] = useState<boolean>(false);
  const [openInstalmentsEditDialog, setOpenInstalmentsEditDialog] = useState<boolean>(false);
  const [openPaymentsEditDialog, setOpenPaymentsEditDialog] = useState<boolean>(false);

  const pointsOfSale = establishments.map(establishment => establishment.pointsOfSale).flat();

  const defaultValues: IAddUpdateSale = {
    customer_id: currentSale?.customerId ?? 1,
    currency_id:currentSale?.currencyId ?? 1,
    establishment_id: currentSale?.establishment.id ?? 1,
    point_of_sale_id: currentSale?.pointOfSaleId ?? 1,
    warehouse_id: currentSale?.warehouseId ?? 1,
    seller_id: currentSale?.sellerId ?? 1,
    document_type_id: currentSale?.documentTypeId ?? 1,
    payment_term_id: currentSale?.paymentTermId ?? 1,
    billed_at: dayjs(currentSale?.billedAt) ?? dayjs(),
    expires_at: currentSale?.expiresAt ? dayjs(currentSale?.expiresAt) : null,
    comments: currentSale?.comments ?? '',
    products: currentSale?.products.map(product => ({
      id: product.id,
      product_detail_price_id: product.price.id,
      measurement_unit_id: product.measurementUnitId,
      quantity: product.quantity,
      discount: product.discount * 100,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.productDetail.product.percentageTaxed

    })) ?? [],
    payments: currentSale?.payments.map(payment => ({
      id: payment.id,
      currency_id: payment.currencyId,
      payment_method_id: payment.paymentMethodId,
      paid_at: dayjs(payment.paidAt),
      amount: payment.amount,
      comments: payment.comments
    })) ?? [],
    instalments: currentSale?.instalments.map(instalment => ({
      id: instalment.id,
      number: instalment.number,
      expires_at: dayjs(instalment.expiresAt),
      amount: instalment.amount
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
    document_type_id: yup.number().required(),
    payment_term_id: yup.number().required(),
    billed_at: yup.string().required(),
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
  } = useForm<IAddUpdateSale>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  let watchBilledAt = watch('billed_at');
  let watchCurrency = watch('currency_id');
  let watchEstablishment = watch('establishment_id');
  let watchPaymentTerm = watch('payment_term_id');
  let watchPayments = watch('payments');
  let watchInstalments = watch('instalments');

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

  const {
    fields: paymentFields,
    append: paymentAppend,
    update: paymentUpdate,
    replace: paymentReplace,
    remove: paymentRemove
  } = useFieldArray({
    control,
    name: "payments",
    keyName: "key"
  });

  const {
    replace: instalmentReplace,
    remove: instalmentRemove
  } = useFieldArray({
    control,
    name: "instalments",
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
    if(watchPaymentTerm !== 1) {
      setShowPaymentsButton(false);
      setShowExpiresAtField(true);
      setShowInstalmentsButton(true);
    } else {
      setShowPaymentsButton(true);
      setShowExpiresAtField(false);
      setShowInstalmentsButton(false);
    }
    if (mountedPaymentTerm) {
      if(watchPaymentTerm !== 1) {
        instalmentReplace([{
          number: 1,
          expires_at: dayjs(getValues('billed_at')).add(1, 'month'),
          amount: saleTotals.total
        }]);
        paymentRemove();
      } else {
        paymentReplace([{
          payment_method_id: 1,
          currency_id: watchCurrency,
          paid_at: dayjs(getValues('billed_at')),
          amount: saleTotals.total,
          comments: null
        }]);
        instalmentRemove();
      }
    } else {
      setMountedPaymentTerm(true);
    }
  }, [watchPaymentTerm]);

  useEffect(() => {
    const newDefaultPointOfSale = establishments.find(establishment => establishment.id === watchEstablishment && establishment.id === defaultValues.establishment_id) ?? establishments.find(establishment => establishment.id === watchEstablishment);
    setValue('point_of_sale_id', newDefaultPointOfSale!.id);
  }, [watchEstablishment]);

  /**
   * Get the selected services
   */
  const getSelectedProducts = () => {
    let saleTotals: AddSaleTotalsType = {
      currency: currencies.find(currency => currency.id == watchCurrency)!,
      subtotal: 0,
      discount: 0,
      total: 0
    };
    const selectedProducts = productFields.map((selectedProduct, index) => {
      const productDetailPrice = productDetails.map(productDetail => productDetail.prices.find(productDetailPrice => productDetailPrice.id == selectedProduct.product_detail_price_id)).filter(product => product)[0];
      const productDetail = productDetails.find(productDetail => productDetail.id == productDetailPrice?.productDetailId);

      saleTotals.subtotal += productDetailPrice!.amount * selectedProduct.quantity;
      saleTotals.discount += productDetailPrice!.amount * selectedProduct.quantity * selectedProduct.discount;
      saleTotals.total = saleTotals.subtotal - saleTotals.discount;
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
    setSaleTotals(saleTotals);
    console.log('hola')
    if (mountedProducts) {
      if(watchPaymentTerm !== 1) {
        instalmentReplace([{
          number: 1,
          expires_at: dayjs(getValues('billed_at')).add(1, 'month'),
          amount: saleTotals.total
        }]);
        paymentRemove();
      } else {
        paymentReplace([{
          payment_method_id: 1,
          currency_id: watchCurrency,
          paid_at: dayjs(getValues('billed_at')),
          amount: saleTotals.total,
          comments: null
        }]);
        instalmentRemove();
      }
    } else {
      setMountedProducts(true);
    }
  };

  /**
   * Payments add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handlePaymentsEditSubmit = (payments: IAddUpdateSalePayment[]) => {
    paymentReplace(payments);
    setOpenPaymentsEditDialog(false);
  };

  /**
   * Instalment add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleInstalmentsEditSubmit = (instalments: IUpdateSaleInstalment[]) => {
    instalmentReplace(instalments);
    setOpenInstalmentsEditDialog(false);
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
   * Payments add edit dialog close handler
   */
  const handlePaymentsEditDialogClose = () => {
    setOpenPaymentsEditDialog(false);
  };

  /**
   * Instalment add edit dialog close handler
   */
  const handleInstalmentsEditDialogClose = () => {
    setOpenInstalmentsEditDialog(false);
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
                {t('add_sale')}
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
                            name='billed_at'
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
                          {errors.billed_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.billed_at.message}`)}</FormHelperText>}
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
                          <Grid item xs={12} md={3}>
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

                          <Grid item xs={12} md={3}>
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
                              {errors.payment_term_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.payment_term_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          <Grid item xs>
                            <FormControl fullWidth size='small'>
                              <Controller
                                name='payment_term_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    openOnFocus
                                    disableClearable
                                    options={paymentTerms}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, newValue) => {onChange(newValue.id)}}
                                    value={paymentTerms.find(paymentTerm => paymentTerm.id == value)!}
                                    renderInput={params => <TextField {...params} label={t('payment_term')} size='small' />}
                                  />
                                )}
                              />
                              {errors.payment_term_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.payment_term_id.message}`)}</FormHelperText>}
                            </FormControl>
                          </Grid>

                          {showPaymentsButton &&
                            <Grid item alignItems="stretch" style={{ display: "flex" }}>
                              <Button variant='outlined' color='primary' size='small' onClick={() => setOpenPaymentsEditDialog(true)}>
                                <CashMultipleIcon /> {t('payments')}
                              </Button>
                            </Grid>
                          }

                          {showExpiresAtField && 
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
                          }

                          {showInstalmentsButton &&
                            <Grid item alignItems="stretch" style={{ display: "flex" }}>
                              <Button variant='outlined' color='primary' size='small' onClick={() => setOpenInstalmentsEditDialog(true)}>
                                <CalendarOutlineIcon /> {t('instalments')}
                              </Button>
                            </Grid>
                          }
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
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

                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size='small'>
                          <Controller
                            name='point_of_sale_id'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                openOnFocus
                                disableClearable
                                options={pointsOfSale.filter(pointsOfSale => pointsOfSale.establishmentId == watchEstablishment)}
                                getOptionLabel={option => String(option.number)}
                                onChange={(event, newValue) => {onChange(newValue.id)}}
                                value={pointsOfSale.find(pointOfSale => pointOfSale.id == value)}
                                renderInput={params => <TextField {...params} label={t('point_of_sale')} size='small' />}
                              />
                            )}
                          />
                          {errors.point_of_sale_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.point_of_sale_id.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleTotals.subtotal, saleTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('discount')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleTotals.discount, saleTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{t('total')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(saleTotals.total, saleTotals.currency)}</Typography>
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
                  <ContentSaveIcon /> {t('finalize_sale')}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      {openPaymentsEditDialog &&
        <SalePaymentsAddEditDialog
          open={openPaymentsEditDialog}
          selectedPayments={watchPayments}
          onSubmit={handlePaymentsEditSubmit}
          onClose={handlePaymentsEditDialogClose}
        />
      }

      {openInstalmentsEditDialog &&
        <SaleInstalmentEditDialog
          open={openInstalmentsEditDialog}
          date={watchBilledAt}
          selectedInstalments={watchInstalments}
          currency={currencies.find((currency) => currency.id === watchCurrency)}
          totalAmount={saleTotals.total}
          onSubmit={handleInstalmentsEditSubmit}
          onClose={handleInstalmentsEditDialogClose}
        />
      }
    </>
  );
};

export default SaleAddEditDialog;
