// ** React Imports
import { SyntheticEvent, useState } from 'react';

// ** Interfaces and Models Imports
import { IAddSupplier } from 'src/interfaces/supplier/add';
import { IAddUpdateSupplierContact } from 'src/interfaces/supplier/addUpdateContact';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, Box, Typography, styled, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import FileDocumentOutlineIcon from 'mdi-material-ui/FileDocumentOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import AccountMultipleOutlineIcon from 'mdi-material-ui/AccountMultipleOutline';
import MapMarkerIcon from 'mdi-material-ui/MapMarker';
import PlusIcon from 'mdi-material-ui/Plus';
import PlusCircleOutlineIcon from 'mdi-material-ui/PlusCircleOutline';
import FileEditOutlineIcon from 'mdi-material-ui/FileEditOutline';

// ** Third Party Imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import SupplierContactAddEditDialog from './ContactAddEditDialog';
import { IAddUpdateSupplierAddress } from 'src/interfaces/supplier/addUpdateAddress';
import SupplierAddressAddEditDialog from './AddressAddEditDialog';
import { addSchema } from 'src/schemes/supplier';
import { t } from 'i18next';
import Tab from 'src/components/mui/Tab';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddSupplier) => void;
  onClose: () => void;
}

/**
 * Supplier edit dialog
 * @param props component parameters
 * @returns Supplier Edit Dialog component
 */
const SupplierAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');
  const [openBillingAddressAddEditDialog, setOpenBillingAddressAddEditDialog] = useState<boolean>(false);
  const [selectedContactIndex, setSelectedContactIndex] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<IAddUpdateSupplierContact>();
  const [openContactAddEditDialog, setOpenContactAddEditDialog] = useState<boolean>(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>();
  const [selectedAddress, setSelectedAddress] = useState<IAddUpdateSupplierAddress>();
  const [openAddressAddEditDialog, setOpenAddressAddEditDialog] = useState<boolean>(false);

  const defaultValues: IAddSupplier = {
    name: '',
    identification_document: '',
    email: '',
    address: '',
    phones: [],
    contacts: [],
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
  } = useForm<IAddSupplier>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(addSchema)
  });

  const {
    fields: contactFields,
    append: contactAppend,
    update: contactUpdate,
    remove: contactRemove
  } = useFieldArray({
    control,
    name: "contacts"
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
   * Contact add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleContactAddEditSubmit = async (formFields: IAddUpdateSupplierContact) => {
    if (selectedContact) {
      contactUpdate(selectedContactIndex!, formFields);
    } else {
      contactAppend(formFields);
    }
    setSelectedContactIndex(undefined);
    setSelectedContact(undefined);
    setOpenContactAddEditDialog(false);
  };

  /**
   * Contact edit click event handler
   * @param index selected detail index
   * @param selecetedPrices current detail prices
   */
  const handleContactEditClick = (index: number, selectedContact: IAddUpdateSupplierContact) => {
    setSelectedContactIndex(index);
    setSelectedContact(selectedContact);
    setOpenContactAddEditDialog(true);
  };

  /**
   * Address add edit event submit handler
   * @param formFields form fields submitted by user
   */
  const handleAddressAddEditSubmit = async (formFields: IAddUpdateSupplierAddress) => {
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
  const handleAddressEditClick = (index: number, selectedAddress: IAddUpdateSupplierAddress) => {
    setSelectedAddressIndex(index);
    setSelectedAddress(selectedAddress);
    setOpenAddressAddEditDialog(true);
  };

  /**
   * Dialog handlers
   */

  /**
   * Contact add edit dialog close handler
   */
  const handleContactAddEditDialogClose = () => {
    setOpenContactAddEditDialog(false);
    setSelectedContactIndex(undefined);
    setSelectedContact(undefined);
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
          {t('add_supplier')}
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
                    START SUPPLIER DEFINITION
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
                        <Typography variant='h6'>{t('contacts')}</Typography>
                        {contactFields.map((contact, index) => (
                          <Box key={index} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccountMultipleOutlineIcon fontSize='large' />
                              <Box sx={{ ml: 4 }}>
                                <Typography sx={{ fontWeight: 600 }}>{t('name')}: {contact.name}</Typography>
                                <Typography variant='body2'>{t('phone')}: {contact.phone}</Typography>
                                <Typography variant='body2'>{t('email')}: {contact.email}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                                <Button variant='outlined' color='primary' onClick={() => handleContactEditClick(index, contact)}><FileEditOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                              <Tooltip title={t('delete')}>
                                <Button variant='outlined' color='error' onClick={() => contactRemove(index)}><DeleteOutlineIcon fontSize='small' /></Button>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))}
                        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpenContactAddEditDialog(true)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlusCircleOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('add_contact')}</Typography>
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
                          <Box key={index} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
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
                    END SUPPLIER DEFINITION
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

      {openContactAddEditDialog &&
        <SupplierContactAddEditDialog
          open={openContactAddEditDialog}
          loading={false}
          defaultFormValues={selectedContact}
          onSubmit={handleContactAddEditSubmit}
          onClose={handleContactAddEditDialogClose}
        />
      }

      {openAddressAddEditDialog &&
        <SupplierAddressAddEditDialog
          open={openAddressAddEditDialog}
          loading={false}
          defaultFormValues={selectedAddress}
          onSubmit={handleAddressAddEditSubmit}
          onClose={handleAddressAddEditDialogClose}
        />
      }
    </>
  );
};

export default SupplierAddDialog;
