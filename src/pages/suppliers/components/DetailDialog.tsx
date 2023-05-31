// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { MSupplierContact } from 'src/models/supplier/contact';
import { MSupplierAddress } from 'src/models/supplier/address';

// ** MUI Imports
import { Dialog, DialogContent, FormControl, DialogTitle, Box, Typography, Grid, Autocomplete, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from 'src/components/mui/Tab';

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
  onContactAddClick: () => void;
  onContactEditClick: (contact: MSupplierContact) => void;
  onContactDeleteClick: (contact: MSupplierContact) => void;
  onAddressAddClick: () => void;
  onAddressEditClick: (address: MSupplierAddress) => void;
  onAddressDeleteClick: (address: MSupplierAddress) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Supplier edit dialog
 * @param props component parameters
 * @returns Supplier Edit Dialog component
 */
const SupplierDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onContactAddClick, onContactEditClick, onContactDeleteClick, onAddressAddClick, onAddressEditClick, onAddressDeleteClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { supplierReducer: { currentSupplier } } = useAppSelector((state) => state);
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
          {t('supplier_data')}
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
                  START SUPPLIER DEFINITION
                */}
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentSupplier?.name ?? ''}
                        label={t('name')}
                        size='small'
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentSupplier?.identificationDocument ?? ''}
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
                        options={currentSupplier?.phones ?? []}
                        value={currentSupplier?.phones ?? []}
                        renderInput={params => <TextField {...params} label={t('phone')} />}
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentSupplier?.email ?? ''}
                        label={t('email')}
                        size='small'
                      />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <TextField
                        value={currentSupplier?.address ?? ''}
                        multiline
                        rows={3}
                        label={t('address')}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mx: 6 }}>
                      <Typography variant='h6'>{t('contacts')}</Typography>
                      {currentSupplier?.contacts.map((contact, index) => (
                        <Box key={contact.id} sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
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
                              <Button variant='outlined' color='primary' onClick={() => onContactEditClick(contact)}><FileEditOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                            <Tooltip title={t('delete')}>
                              <Button variant='outlined' color='error' onClick={() => onContactDeleteClick(contact)}><DeleteOutlineIcon fontSize='small' /></Button>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                      <Box sx={{ my: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={onContactAddClick}>
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
                      {currentSupplier?.addresses.map((address, index) => (
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
                  END SUPPLIER DEFINITION
                */}
              </TabPanel>
            </Box>
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupplierDetailDialog;
