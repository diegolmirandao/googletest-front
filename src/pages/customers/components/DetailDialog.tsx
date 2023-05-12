// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { MCustomerBillingAddress } from 'src/models/customer/billingAddress';
import { MCustomerReference } from 'src/models/customer/reference';
import { MCustomerAddress } from 'src/models/customer/address';

// ** MUI Imports
import { Dialog, DialogContent, FormControl, DialogTitle, Box, Typography, Grid, InputLabel, Select, MenuItem, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from 'src/components/mui/tab';

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
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import { t } from 'i18next';

// ** Third Party Imports

/**
 * Component props
 */
interface IProps {
  open: boolean;
  onEditClick: () => void;
  onBillingAddressAddClick: () => void;
  onBillingAddressEditClick: (billingAddress: MCustomerBillingAddress) => void;
  onBillingAddressDeleteClick: (billingAddress: MCustomerBillingAddress) => void;
  onReferenceAddClick: () => void;
  onReferenceEditClick: (reference: MCustomerReference) => void;
  onReferenceDeleteClick: (reference: MCustomerReference) => void;
  onAddressAddClick: () => void;
  onAddressEditClick: (address: MCustomerAddress) => void;
  onAddressDeleteClick: (address: MCustomerAddress) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onBillingAddressAddClick, onBillingAddressEditClick, onBillingAddressDeleteClick, onReferenceAddClick, onReferenceEditClick, onReferenceDeleteClick, onAddressAddClick, onAddressEditClick, onAddressDeleteClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { customerReducer: { currentCustomer } } = useAppSelector((state) => state);
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');

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
          {t('customer_data')}
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
                      <TextField
                        value={currentCustomer?.name}
                        label={t('name')}
                        size='small'
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentCustomer?.identificationDocument}
                        label={t('identification_document')}
                        size='small'
                      />
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <Autocomplete
                        readOnly
                        freeSolo
                        multiple
                        size='small'
                        options={currentCustomer?.phones ?? []}
                        value={currentCustomer?.phones ?? []}
                        renderInput={params => <TextField {...params} label={t('phone')} />}
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentCustomer?.email}
                        label={t('email')}
                        size='small'
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentCustomer?.birthday}
                        label={t('birthday')}
                        size='small'
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='category-select'>{t('category')}</InputLabel>
                        <Select
                          readOnly
                          fullWidth
                          id='select-category'
                          label={t('category')}
                          labelId='category-select'
                          value={currentCustomer?.category.id}
                        >
                          <MenuItem  value={currentCustomer?.category.id}>{currentCustomer?.category.name}</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }} size='small'>
                      <InputLabel id='acquisition-channel-select'>{t('acquisition_channel')}</InputLabel>
                      <Select
                        readOnly
                        fullWidth
                        id='select-acquisition-channel'
                        label={t('acquisition_channel')}
                        labelId='acquisition-channel-select'
                        value={currentCustomer?.acquisitionChannel.id}
                      >
                        <MenuItem value={currentCustomer?.acquisitionChannel.id}>{currentCustomer?.acquisitionChannel.name}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentCustomer?.address}
                        multiline
                        rows={3}
                        label={t('address')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mx: 6 }}>
                      <Typography variant='h6'>{t('billing_address')}</Typography>
                      {currentCustomer?.billingAddresses.map((billingAddress, index) => (
                        <Box key={billingAddress.id} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BadgeAccountOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('name')}: {billingAddress.name}</Typography>
                              <Typography variant='body2'>{t('identification_document')}: {billingAddress.identificationDocument}</Typography>
                              <Typography variant='body2'>{t('phone')}: {billingAddress.phone}</Typography>
                              <Typography variant='body2'>{t('address')}: {billingAddress.address}</Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                              <Button variant='outlined' color='primary' onClick={() => onBillingAddressEditClick(billingAddress)}><FileEditOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                            <Tooltip title={t('delete')}>
                              <Button variant='outlined' color='error' onClick={() => onBillingAddressDeleteClick(billingAddress)}><DeleteOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                      <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={onBillingAddressAddClick}>
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
                      {currentCustomer?.references.map((reference, index) => (
                        <Box key={reference.id} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountMultipleOutlineIcon fontSize='large' />
                            <Box sx={{ ml: 4 }}>
                              <Typography sx={{ fontWeight: 600 }}>{t('name')}: {reference.name}</Typography>
                              <Typography variant='body2'>{t('identification_document')}: {reference.identificationDocument}</Typography>
                              <Typography variant='body2'>{t('phone')}: {reference.phone}</Typography>
                              <Typography variant='body2'>{t('address')}: {reference.address}</Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Tooltip title={t('edit')} sx={{ mr: 2 }}>
                              <Button variant='outlined' color='primary' onClick={() => onReferenceEditClick(reference)}><FileEditOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                            <Tooltip title={t('delete')}>
                              <Button variant='outlined' color='error' onClick={() => onReferenceDeleteClick(reference)}><DeleteOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                      <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={onReferenceAddClick}>
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
                      {currentCustomer?.addresses.map((address, index) => (
                        <Box key={address.id} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
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
                              <Button variant='outlined' color='primary' onClick={() => onAddressEditClick(address)}><FileEditOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                            <Tooltip title={t('delete')}>
                              <Button variant='outlined' color='error' onClick={() => onAddressDeleteClick(address)}><DeleteOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                      <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={onAddressAddClick}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PlusCircleOutlineIcon fontSize='large' />
                          <Box sx={{ ml: 4 }}>
                            <Typography sx={{ fontWeight: 600 }}>{t('add_address')}</Typography>
                          </Box>
                        </Box>
                        <Tooltip title={t('add')}>
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
      </Dialog>
    </>
  );
};

export default CustomerDetailDialog;
