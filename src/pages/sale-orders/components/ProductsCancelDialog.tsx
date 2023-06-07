// ** React Imports
import { useAppSelector } from 'src/hooks/redux';
import { useEffect, useState } from 'react';

// ** Interfaces and Models Imports
import { IAddSaleOrderProduct } from 'src/interfaces/sale-order/addProduct';
import { MCurrency } from 'src/models/currency';
import { MProductDetail } from 'src/models/product/detail';
import { MProductDetailPrice } from 'src/models/product/detailPrice';

// ** MUI Imports
import { DataGridPro, GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, InputAdornment, Autocomplete, Grid, Divider, Tooltip, Box, MenuItem, Typography, Select } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import InformationOutlineIcon from 'mdi-material-ui/InformationOutline';

// ** Third Party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { t } from 'i18next';
import { formatMoney } from 'src/utils/format';
import NumericInput from 'src/components/inputmask/NumericInput';
import DecimalPercentageInput from 'src/components/inputmask/DecimalPercentageInput';
import { toast } from 'react-toastify';
import { setDataGridLocale } from 'src/utils/common';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddSaleOrderProduct[]) => void;
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
 * Product add dialog
 * @param props component parameters
 * @returns Product Add Dialog component
 */
const SaleOrderProductsCancelDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { saleOrderReducer: { currentSaleOrder, currentSaleOrderProduct }, currencyReducer: { currencies }, productReducer: { products, productDetails } } = useAppSelector((state) => state);
  // ** Vars
  const [selectedProductCode, setSelectedProductCode] = useState<string>('');
  const [selectedProductByDescription, setSelectedProductByDescription] = useState<MProductDetail | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<AddSaleOrderProductType[]>([]);
  const [saleOrderTotals, setSaleOrderTotals] = useState<AddSaleOrderTotalsType>({currency: currencies[0], subtotal: 0, discount: 0, total: 0});

  const defaultValues: {products: IAddSaleOrderProduct[]} = {
      products: []
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
   * Form
   */
  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

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

  /**
   * Get the selected services
   */
  const getSelectedProducts = () => {
    let saleOrderTotals: AddSaleOrderTotalsType = {
      currency: currencies.find(currency => currency.id == currentSaleOrder!.currencyId)!,
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
    <Dialog
      fullWidth
      open={open}
      maxWidth='xl'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {t('cancel_products')}
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit((data) => onSubmit(data.products))}>
        <DialogContent>
          <Grid container spacing={3}>
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

            <Grid item xs={12}>
              {/*
                START PRODUCTS
              */}
              <DataGridPro
                columns={columns} 
                rows={selectedProducts} 
                localeText={setDataGridLocale()}
                disableColumnMenu={true}
                hideFooterRowCount
                hideFooter
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                sx={{ minHeight: 250, height: '48vh' }}
              />
              {/*
                END PRODUCTS
              */}
            </Grid>

            <Grid item xs={12}>
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
  );
};

export default SaleOrderProductsCancelDialog;
