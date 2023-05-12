// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddCustomer } from 'src/interfaces/customer/add';
import { IAddUpdateCustomerBillingAddress } from 'src/interfaces/customer/addUpdateBillingAddress';
import { IAddUpdateCustomerReference } from 'src/interfaces/customer/addUpdateReference';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, Box, Typography, styled, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import MuiTab, { TabProps } from '@mui/material/Tab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import FileDocumentOutlineIcon from 'mdi-material-ui/FileDocumentOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import BadgeAccountOutlineIcon from 'mdi-material-ui/BadgeAccountOutline';
import AccountMultipleOutlineIcon from 'mdi-material-ui/AccountMultipleOutline';
import MapMarkerIcon from 'mdi-material-ui/MapMarker';
import PlusIcon from 'mdi-material-ui/Plus';
import PlusCircleOutlineIcon from 'mdi-material-ui/PlusCircleOutline';
import FileEditOutlineIcon from 'mdi-material-ui/FileEditOutline';

// ** Third Party Imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import CustomerBillingAddressAddEditDialog from './BillingAddressAddEditDialog';
import CustomerReferenceAddEditDialog from './ReferenceAddEditDialog';
import { IAddUpdateCustomerAddress } from 'src/interfaces/customer/addUpdateAddress';
import CustomerAddressAddEditDialog from './AddressAddEditDialog';
import { addSchema } from 'src/schemes/customer';
import { t } from 'i18next';
import Tab from 'src/components/mui/tab';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddCustomer) => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { customerCategoryReducer: { customerCategories }, acquisitionChannelReducer: { acquisitionChannels } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');
  const [selectedBillingAddressIndex, setSelectedBillingAddressIndex] = useState<number>();
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<IAddUpdateCustomerBillingAddress>();
  const [openBillingAddressAddEditDialog, setOpenBillingAddressAddEditDialog] = useState<boolean>(false);
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number>();
  const [selectedReference, setSelectedReference] = useState<IAddUpdateCustomerReference>();
  const [openReferenceAddEditDialog, setOpenReferenceAddEditDialog] = useState<boolean>(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>();
  const [selectedAddress, setSelectedAddress] = useState<IAddUpdateCustomerAddress>();
  const [openAddressAddEditDialog, setOpenAddressAddEditDialog] = useState<boolean>(false);

  const defaultValues: IAddCustomer = {
    customer_category_id: 1,
    acquisition_channel_id: 1,
    name: '',
    identification_document: '',
    email: '',
    birthday: '',
    address: '',
    phones: [],
    billing_addresses: [],
    references: [],
    addresses: []
  };

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<IAddCustomer>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(addSchema)
  });

  const {
    fields: billingAddressFields,
    append: billingAddressAppend,
    update: billingAddressUpdate,
    remove: billingAddressRemove
  } = useFieldArray({
    control,
    name: "billing_addresses"
  });

  const {
    fields: referenceFields,
    append: referenceAppend,
    update: referenceUpdate,
    remove: referenceRemove
  } = useFieldArray({
    control,
    name: "references"
  });

  const {
    fields: addressFields,
    append: addressAppend,
    update: addressUpdate,
    remove: addressRemove
  } = useFieldArray({
    control,
    name: "addresses"
  });

  /**
   * Tab change event handler
   * @param event tab change event
   * @param newValue new selected tab
   */
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  /**
   * Billing address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleBillingAddressAddEditSubmit = async (formFields: IAddUpdateCustomerBillingAddress) => {
    if (selectedBillingAddress) {
      billingAddressUpdate(selectedBillingAddressIndex!, formFields);
    } else {
      billingAddressAppend(formFields);
    }
    setSelectedBillingAddressIndex(undefined);
    setSelectedBillingAddress(undefined);
    setOpenBillingAddressAddEditDialog(false);
  };

  /**
   * Billing address edit click event handler
   * @param index selected detail index
   * @param selecetedPrices current detail prices
   */
  const handleBillingAddressEditClick = (index: number, selectedBillingAddress: IAddUpdateCustomerBillingAddress) => {
    setSelectedBillingAddressIndex(index);
    setSelectedBillingAddress(selectedBillingAddress);
    setOpenBillingAddressAddEditDialog(true);
  };

  /**
   * Reference add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleReferenceAddEditSubmit = async (formFields: IAddUpdateCustomerReference) => {
    if (selectedReference) {
      referenceUpdate(selectedReferenceIndex!, formFields);
    } else {
      referenceAppend(formFields);
    }
    setSelectedReferenceIndex(undefined);
    setSelectedReference(undefined);
    setOpenReferenceAddEditDialog(false);
  };

  /**
   * Reference edit click event handler
   * @param index selected detail index
   * @param selecetedPrices current detail prices
   */
  const handleReferenceEditClick = (index: number, selectedReference: IAddUpdateCustomerReference) => {
    setSelectedReferenceIndex(index);
    setSelectedReference(selectedReference);
    setOpenReferenceAddEditDialog(true);
  };

  /**
   * Address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddressAddEditSubmit = async (formFields: IAddUpdateCustomerAddress) => {
    if (selectedAddress) {
      addressUpdate(selectedAddressIndex!, formFields);
    } else {
      addressAppend(formFields);
    }
    setSelectedAddressIndex(undefined);
    setSelectedAddress(undefined);
    setOpenAddressAddEditDialog(false);
  };

  /**
   * Address edit click event handler
   * @param index selected detail index
   * @param selecetedPrices current detail prices
   */
  const handleAddressEditClick = (index: number, selectedAddress: IAddUpdateCustomerAddress) => {
    setSelectedAddressIndex(index);
    setSelectedAddress(selectedAddress);
    setOpenAddressAddEditDialog(true);
  };

  /**
   * Dialog handlers
   */

  /**
   * Billing address add edit dialog close handler
   */
  const handleBillingAddressAddEditDialogClose = () => {
    setOpenBillingAddressAddEditDialog(false);
    setSelectedBillingAddressIndex(undefined);
    setSelectedBillingAddress(undefined);
  };

  /**
   * Reference add edit dialog close handler
   */
  const handleReferenceAddEditDialogClose = () => {
    setOpenReferenceAddEditDialog(false);
    setSelectedReferenceIndex(undefined);
    setSelectedReference(undefined);
  };

  /**
   * Address add edit dialog close handler
   */
  const handleAddressAddEditDialogClose = () => {
    setOpenAddressAddEditDialog(false);
    setSelectedAddressIndex(undefined);
    setSelectedAddress(undefined);
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
          {t('add_customer')}
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
                <Tab value='parameters' label={t('parameters')} icon={<FileCogOutlineIcon />} />
              </TabList>
              <Box sx={{ mt: 3 }}>
                <TabPanel value='definition'>
                  {/*
                    START CUSTOMER DEFINITION
                  */}
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='name'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={t('name')}
                            size='small'
                            onChange={onChange}
                            error={Boolean(errors.name)}
                          />
                          )}
                        />
                        {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.name.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='identification_document'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={t('identification_document')}
                            size='small'
                            onChange={onChange}
                            error={Boolean(errors.identification_document)}
                          />
                          )}
                        />
                        {errors.identification_document && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.identification_document.message}`)}</FormHelperText>}
                      </FormControl>
                      
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='phones'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              freeSolo
                              autoSelect
                              multiple
                              size='small'
                              options={[]}
                              value={value}
                              onChange={(event, newValue) => {onChange(newValue)}}
                              renderInput={params => <TextField {...params} label={t('phones')} />}
                            />
                          )}
                        />
                        {errors.phones && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.phones.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='email'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={t('email')}
                            size='small'
                            onChange={onChange}
                            error={Boolean(errors.email)}
                          />
                          )}
                        />
                        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.email.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='birthday'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={t('birthday')}
                            size='small'
                            onChange={onChange}
                            error={Boolean(errors.birthday)}
                          />
                          )}
                        />
                        {errors.birthday && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.birthday.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                        <InputLabel id='category-select'>{t('category')}</InputLabel>
                        <Controller
                          name='customer_category_id'
                          control={control}
                          render={({ field: { value } }) => (
                            <Select
                              fullWidth
                              id='select-category'
                              label={t('category')}
                              labelId='category-select'
                              onChange={(e) => {setValue("customer_category_id", Number(e.target.value))}}
                              defaultValue={value}
                              value={value}
                            >
                              {customerCategories.map(category => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.customer_category_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.customer_category_id.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                        <InputLabel id='acquisition-channel-select'>{t('acquisition_channel')}</InputLabel>
                        <Controller
                          name='acquisition_channel_id'
                          control={control}
                          render={({ field: { value } }) => (
                            <Select
                              fullWidth
                              id='select-acquisition-channel'
                              label={t('acquisition_channel')}
                              labelId='acquisition-channel-select'
                              onChange={(e) => {setValue("acquisition_channel_id", Number(e.target.value))}}
                              defaultValue={value}
                              value={value}
                            >
                              {acquisitionChannels.map(acquisitionChannel => (
                                <MenuItem key={acquisitionChannel.id} value={acquisitionChannel.id}>{acquisitionChannel.name}</MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.acquisition_channel_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.acquisition_channel_id.message}`)}</FormHelperText>}
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='address'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            multiline
                            rows={3}
                            label={t('address')}
                            onChange={onChange}
                            error={Boolean(errors.address)}
                          />
                          )}
                        />
                        {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.address.message}`)}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mx: 6 }}>
                        <Typography variant='h6'>{t('billing_address')}</Typography>
                        {billingAddressFields.map((billingAddress, index) => (
                          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <BadgeAccountOutlineIcon fontSize='large' />
                              <Box sx={{ ml: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('name')}: {billingAddress.name}</Typography>
                                <Typography variant='body2'>{t('identification_document')}: {billingAddress.identification_document}</Typography>
                                <Typography variant='body2'>{t('phone')}: {billingAddress.phone}</Typography>
                                <Typography variant='body2'>{t('address')}: {billingAddress.address}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                                <Button variant='outlined' color='primary' onClick={() => handleBillingAddressEditClick(index, billingAddress)}><FileEditOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                              <Tooltip title={t('delete')}>
                                <Button variant='outlined' color='error' onClick={() => billingAddressRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))}
                        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpenBillingAddressAddEditDialog(true)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlusCircleOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('add_billing_address')}</Typography>
                            </Box>
                          </Box>
                          <Tooltip title={t('add')}>
                            <Button variant='outlined' color='primary'><PlusIcon fontSize='small' /></Button>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box sx={{ mx: 6 }}>
                        <Typography variant='h6'>{t('references')}</Typography>
                        {referenceFields.map((reference, index) => (
                          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccountMultipleOutlineIcon fontSize='large' />
                              <Box sx={{ ml: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('name')}: {reference.name}</Typography>
                                <Typography variant='body2'>{t('identification_document')}: {reference.identification_document}</Typography>
                                <Typography variant='body2'>{t('phone')}: {reference.phone}</Typography>
                                <Typography variant='body2'>{t('address')}: {reference.address}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                                <Button variant='outlined' color='primary' onClick={() => handleReferenceEditClick(index, reference)}><FileEditOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                              <Tooltip title={t('delete')}>
                                <Button variant='outlined' color='error' onClick={() => referenceRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))}
                        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpenReferenceAddEditDialog(true)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlusCircleOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('add_reference')}</Typography>
                            </Box>
                          </Box>
                          <Tooltip title={t('add')}>
                            <Button variant='outlined' color='primary'><PlusIcon fontSize='small' /></Button>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box sx={{ mx: 6 }}>
                        <Typography variant='h6'>{t('addresses')}</Typography>
                        {addressFields.map((address, index) => (
                          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MapMarkerIcon fontSize='large' />
                              <Box sx={{ ml: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('name')}: {address.name}</Typography>
                                <Typography variant='body2'>{t('phone')}: {address.phone}</Typography>
                                <Typography variant='body2'>{t('city')}: {address.phone}</Typography>
                                <Typography variant='body2'>{t('address')}: {address.address}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                                <Button variant='outlined' color='primary' onClick={() => handleAddressEditClick(index, address)}><FileEditOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                              <Tooltip title={t('delete')}>
                                <Button variant='outlined' color='error' onClick={() => addressRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))}
                        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpenAddressAddEditDialog(true)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlusCircleOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('add_address')}</Typography>
                            </Box>
                          </Box>
                          <Tooltip title="Agregar">
                            <Button variant='outlined' color='primary'><PlusIcon fontSize='small' /></Button>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  {/*
                    END CUSTOMER DEFINITION
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

      {openBillingAddressAddEditDialog &&
        <CustomerBillingAddressAddEditDialog
          open={openBillingAddressAddEditDialog}
          loading={false}
          selectedBillingAddress={selectedBillingAddress}
          onSubmit={handleBillingAddressAddEditSubmit}
          onClose={handleBillingAddressAddEditDialogClose}
        />
      }

      {openReferenceAddEditDialog &&
        <CustomerReferenceAddEditDialog
          open={openReferenceAddEditDialog}
          loading={false}
          selectedReference={selectedReference}
          onSubmit={handleReferenceAddEditSubmit}
          onClose={handleReferenceAddEditDialogClose}
        />
      }

      {openAddressAddEditDialog &&
        <CustomerAddressAddEditDialog
          open={openAddressAddEditDialog}
          loading={false}
          selectedAddress={selectedAddress}
          onSubmit={handleAddressAddEditSubmit}
          onClose={handleAddressAddEditDialogClose}
        />
      }
    </>
  );
};

export default CustomerAddDialog;
