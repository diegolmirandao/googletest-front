// ** React Imports
import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdatePurchase } from 'src/interfaces/purchase/addUpdate';
import { formatMoney } from 'src/utils/format';
import { MProductDetail } from 'src/models/product/detail';
import { MProductDetailCost } from 'src/models/product/detailCost';
import { MCurrency } from 'src/models/currency';
import { IUpdatePurchaseInstalment } from 'src/interfaces/purchase/updateInstalment';

// ** MUI Imports
import { DataGridPro } from '@mui/x-data-grid-pro';
import { GridColDef, GridValueGetterParams, GridRenderCellParams, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, FormControl, FormHelperText, Typography, Grid, Select, MenuItem, Autocomplete, Tooltip } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers-pro';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import ContentSaveIcon from 'mdi-material-ui/ContentSave';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import CalendarOutlineIcon from 'mdi-material-ui/CalendarOutline';
import CashMultipleIcon from 'mdi-material-ui/CashMultiple';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';

// ** Third Party Imports
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import PurchaseInstalmentEditDialog from './InstalmentsEditDialog';
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';
import PurchasePaymentsAddEditDialog from './PaymentsEditDialog';
import { IAddUpdatePurchasePayment } from 'src/interfaces/purchase/addUpdatePayment';
import DecimalPercentageInput from 'src/components/inputmask/DecimalPercentageInput';
import NumericInput from 'src/components/inputmask/NumericInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddUpdatePurchase) => void;
  onClose: () => void;
}

/**
 * Purchase product type to display in datagrid
 */
type AddPurchaseProductType = {
  index: number;
  id: number;
  productDetail: MProductDetail;
  productDetailCost: MProductDetailCost;
  quantity: number;
  discount: number;
};

/**
 * Purchase totals type to display
 */
type AddPurchaseTotalsType = {
  currency: MCurrency,
  subtotal: number,
  discount: number,
  total: number
};

/**
 * Purchase edit dialog
 * @param props component parameters
 * @returns Purchase Edit Dialog component
 */
const PurchaseAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { purchaseReducer: { currentPurchase }, supplierReducer: { suppliers }, productReducer: { products, productDetails }, establishmentReducer: { establishments }, warehouseReducer: { warehouses }, measurementUnitReducer: { measurementUnits }, paymentTermReducer: { paymentTerms }, currencyReducer: { currencies }, userReducer: { users } } = useAppSelector((state) => state);
  // ** Vars
  const [mountedProducts, setMountedProducts] = useState<boolean>(false);
  const [mountedPaymentTerm, setMountedPaymentTerm] = useState<boolean>(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string>('');
  const [selectedProductByDescription, setSelectedProductByDescription] = useState<MProductDetail | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<AddPurchaseProductType[]>([]);
  const [purchaseTotals, setPurchaseTotals] = useState<AddPurchaseTotalsType>({currency: currencies[0], subtotal: 0, discount: 0, total: 0});
  const [showPaymentsButton, setShowPaymentsButton] = useState<boolean>(true);
  const [showExpiresAtField, setShowExpiresAtField] = useState<boolean>(false);
  const [showInstalmentsButton, setShowInstalmentsButton] = useState<boolean>(false);
  const [openInstalmentsEditDialog, setOpenInstalmentsEditDialog] = useState<boolean>(false);
  const [openPaymentsEditDialog, setOpenPaymentsEditDialog] = useState<boolean>(false);

  const defaultValues: IAddUpdatePurchase = {
    supplier_id: currentPurchase?.supplierId ?? 1,
    currency_id:currentPurchase?.currencyId ?? 1,
    establishment_id: currentPurchase?.establishment.id ?? 1,
    warehouse_id: currentPurchase?.warehouseId ?? 1,
    document_type_id: currentPurchase?.documentTypeId ?? 1,
    payment_term_id: currentPurchase?.paymentTermId ?? 1,
    purchased_at: dayjs(currentPurchase?.purchasedAt) ?? dayjs(),
    expires_at: currentPurchase?.expiresAt ? dayjs(currentPurchase?.expiresAt) : null,
    comments: currentPurchase?.comments ?? '',
    products: currentPurchase?.products.map(product => ({
      id: product.id,
      product_detail_cost_id: product.cost.id,
      measurement_unit_id: product.measurementUnitId,
      quantity: product.quantity,
      discount: product.discount,
      code: product.code,
      name: product.name,
      taxed: product.taxed,
      tax: product.tax,
      percentage_taxed: product.productDetail.product.percentageTaxed

    })) ?? [],
    payments: currentPurchase?.payments.map(payment => ({
      id: payment.id,
      currency_id: payment.currencyId,
      payment_method_id: payment.paymentMethodId,
      paid_at: dayjs(payment.paidAt),
      amount: payment.amount,
      comments: payment.comments
    })) ?? [],
    instalments: currentPurchase?.instalments.map(instalment => ({
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
      field: 'cost',
      headerName: String(t('cost')),
      renderCell: ({ row }: GridRenderCellParams) => {
        return <Select
          fullWidth
          size='small'
          id='select-cost'
          onChange={(e) => handleProductCostChange(row.index, Number(e.target.value))}
          value={row.productDetailCost.id}
          renderValue={(value) => formatMoney(row.productDetailCost.amount, row.productDetailCost.currency)}
        >
          {row.productDetail.costs.map((cost: MProductDetailCost) => (
            <MenuItem key={cost.id} value={cost.id}>{`${cost.type.name}: ${formatMoney(cost.amount, cost.currency)}`}</MenuItem>
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
    //       value={row.productDetailCost.amount * row.quantity - row.productDetailCost.amount * row.quantity * row.discount}
    //       onChange={(e) => handleProductTotalChange(row.index, Number(e.target.value))}
    //       inputProps={{
    //         sx: { textAlign: 'right'}
    //       }}
    //       InputProps={{
    //         endAdornment: <InputAdornment position='end'>{row.productDetailCost.currency.abbreviation}</InputAdornment>,
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
        return <Typography sx={{ width: '100%', textAlign: 'right' }}>{formatMoney((row.productDetailCost.amount * row.quantity - row.productDetailCost.amount * row.quantity * row.discount), row.productDetailCost.currency)}</Typography>;
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
    supplier_id: yup.number().required(),
    establishment_id: yup.number().required(),
    warehouse_id: yup.number().required(),
    document_type_id: yup.number().required(),
    payment_term_id: yup.number().required(),
    purchased_at: yup.string().required(),
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
  } = useForm<IAddUpdatePurchase>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  let watchPurchasedAt = watch('purchased_at');
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
          expires_at: dayjs(getValues('purchased_at')).add(1, 'month'),
          amount: purchaseTotals.total
        }]);
        paymentRemove();
      } else {
        paymentReplace([{
          payment_method_id: 1,
          currency_id: watchCurrency,
          paid_at: dayjs(getValues('purchased_at')),
          amount: purchaseTotals.total,
          comments: null
        }]);
        instalmentRemove();
      }
    } else {
      setMountedPaymentTerm(true);
    }
  }, [watchPaymentTerm]);

  /**
   * Get the selected services
   */
  const getSelectedProducts = () => {
    let purchaseTotals: AddPurchaseTotalsType = {
      currency: currencies.find(currency => currency.id == watchCurrency)!,
      subtotal: 0,
      discount: 0,
      total: 0
    };
    const selectedProducts = productFields.map((selectedProduct, index) => {
      const productDetailCost = productDetails.map(productDetail => productDetail.costs.find(productDetailCost => productDetailCost.id == selectedProduct.product_detail_cost_id)).filter(product => product)[0];
      const productDetail = productDetails.find(productDetail => productDetail.id == productDetailCost?.productDetailId);

      purchaseTotals.subtotal += productDetailCost!.amount * selectedProduct.quantity;
      purchaseTotals.discount += productDetailCost!.amount * selectedProduct.quantity * selectedProduct.discount;
      purchaseTotals.total = purchaseTotals.subtotal - purchaseTotals.discount;
      return {
        index: index,
        id: productDetail!.id,
        productDetail: productDetail!,
        productDetailCost: productDetailCost!,
        quantity: selectedProduct.quantity,
        discount: selectedProduct.discount
      };
    });
    setSelectedProducts(selectedProducts);
    setPurchaseTotals(purchaseTotals);

    if (mountedProducts) {
      if(watchPaymentTerm !== 1) {
        instalmentReplace([{
          number: 1,
          expires_at: dayjs(getValues('purchased_at')).add(1, 'month'),
          amount: purchaseTotals.total
        }]);
        paymentRemove();
      } else {
        paymentReplace([{
          payment_method_id: 1,
          currency_id: watchCurrency,
          paid_at: dayjs(getValues('purchased_at')),
          amount: purchaseTotals.total,
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
  const handlePaymentsEditSubmit = (payments: IAddUpdatePurchasePayment[]) => {
    paymentReplace(payments);
    setOpenPaymentsEditDialog(false);
  };

  /**
   * Instalment add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleInstalmentsEditSubmit = (instalments: IUpdatePurchaseInstalment[]) => {
    instalmentReplace(instalments);
    setOpenInstalmentsEditDialog(false);
  };

  /**
   * Product select change event handler
   */
  const handleProductSelect = () => {
    console.log(selectedProductByDescription);
    const productDetailCostId = selectedProductByDescription!.costs[0].id;
    const index = productFields.map(productField => productField.product_detail_cost_id).indexOf(productDetailCostId);
    if (index == -1) {
      const product = selectedProductByDescription!;
      productAppend({
        id: null,
        product_detail_cost_id: productDetailCostId,
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
        product_detail_cost_id: productDetailCostId,
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
    const productDetailCostId = selectedProductDetail.costs[0].id;
    const index = productFields.map(productField => productField.product_detail_cost_id).indexOf(productDetailCostId);
    if (index == -1) {
      const product = selectedProductDetail;
      productAppend({
        id: null,
        product_detail_cost_id: productDetailCostId,
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
        product_detail_cost_id: productDetailCostId,
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
   * Product cost change event handler
   * @param index index of product array
   * @param quantity new quantity
   */
  const handleProductCostChange = (index: number, detailCostId: number) => {
    const product = productFields[index];
    productUpdate(index, {
      id: product.id,
      product_detail_cost_id: detailCostId,
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
      product_detail_cost_id: product.product_detail_cost_id,
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
      product_detail_cost_id: product.product_detail_cost_id,
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
    const cost = productDetails.find(productDetail => !productDetail.costs.find(productDetailCost => productDetailCost.id == product.product_detail_cost_id))!.costs.find(productDetailCost => productDetailCost.id == product.product_detail_cost_id)!.amount;
    productUpdate(index, {
      id: product.id,
      product_detail_cost_id: product.product_detail_cost_id,
      measurement_unit_id: product.measurement_unit_id,
      quantity: product.quantity,
      discount: (product.quantity * cost - total) / product.quantity * cost,
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
                {currentPurchase ? t('edit_purchase') : t('add_purchase')}
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
                            name='purchased_at'
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
                          {errors.purchased_at && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.purchased_at.message}`)}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <FormControl fullWidth>
                          <Controller
                            name='supplier_id'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                openOnFocus
                                disableClearable
                                blurOnSelect
                                options={suppliers}
                                getOptionLabel={option => `${option.identificationDocument} - ${option.name}`}
                                onChange={(event, newValue) => {onChange(newValue.id)}}
                                value={suppliers.find(supplier => supplier.id == value)!}
                                renderInput={params => <TextField {...params} label={t('supplier')} />}
                              />
                            )}
                          />
                          {errors.supplier_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.supplier_id.message}`)}</FormHelperText>}
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
                                  <Grid item xs={12} md={2}>{`${t('cost')}: ${formatMoney(option.costs[0].amount, option.costs[0].currency)}`}</Grid>
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
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(purchaseTotals.subtotal, purchaseTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{t('discount')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h5' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(purchaseTotals.discount, purchaseTotals.currency)}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{t('total')}:</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant='h4' sx={{ width: '100%', textAlign: 'right' }}>{formatMoney(purchaseTotals.total, purchaseTotals.currency)}</Typography>
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
                  <ContentSaveIcon /> {t('finalize_purchase')}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      {openPaymentsEditDialog &&
        <PurchasePaymentsAddEditDialog
          open={openPaymentsEditDialog}
          selectedPayments={watchPayments}
          onSubmit={handlePaymentsEditSubmit}
          onClose={handlePaymentsEditDialogClose}
        />
      }

      {openInstalmentsEditDialog &&
        <PurchaseInstalmentEditDialog
          open={openInstalmentsEditDialog}
          date={watchPurchasedAt}
          selectedInstalments={watchInstalments}
          currency={currencies.find((currency) => currency.id === watchCurrency)}
          totalAmount={purchaseTotals.total}
          onSubmit={handleInstalmentsEditSubmit}
          onClose={handleInstalmentsEditDialogClose}
        />
      }
    </>
  );
};

export default PurchaseAddEditDialog;
