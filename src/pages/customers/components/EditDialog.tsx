// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateCustomer } from 'src/interfaces/customer/update';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, DialogTitle, Box, styled, InputLabel, Select, MenuItem, Autocomplete, useMediaQuery, useTheme, FormHelperText } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import MuiTab, { TabProps } from '@mui/material/Tab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import FileDocumentOutlineIcon from 'mdi-material-ui/FileDocumentOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';

// ** Third Party Imports
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Tab from 'src/components/mui/tab';
import { t } from 'i18next';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateCustomer) => void;
  onClose: () => void;
}

/**
 * Customer edit dialog
 * @param props component parameters
 * @returns Customer Edit Dialog component
 */
const CustomerEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;

  // ** Reducers
  const { customerReducer: { currentCustomer }, customerCategoryReducer: { customerCategories }, acquisitionChannelReducer: { acquisitionChannels } } = useAppSelector((state) => state);
  
  // ** Vars
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [ tabValue, setTabValue ] = useState<string>('definition');

  const defaultValues: IUpdateCustomer = {
    customer_category_id: currentCustomer!.customerCategoryId,
    acquisition_channel_id: currentCustomer!.acquisitionChannelId,
    name: currentCustomer!.name,
    identification_document: currentCustomer!.identificationDocument,
    email: currentCustomer!.email,
    birthday: currentCustomer!.birthday,
    address: currentCustomer!.address,
    phones: currentCustomer!.phones.map(phone => phone.phone)
  };

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    customer_category_id: yup.number().required(),
    acquisition_channel_id: yup.number().required(),
    name: yup.string().required(),
    identification_document: yup.string().required(),
    email: yup.string().nullable(),
    birthday: yup.string().nullable(),
    address: yup.string().nullable(),
  });

  /**
   * Form
   */
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<IUpdateCustomer>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
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
        fullScreen={fullScreen}
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('edit_customer')}
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
                      render={({ field: { value, onChange } }) => (
                        <Select
                          fullWidth
                          id='select-category'
                          label={t('category')}
                          labelId='category-select'
                          onChange={(e) => onChange(Number(e.target.value))}
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
                      render={({ field: { value, onChange } }) => (
                        <Select
                          fullWidth
                          id='select-acquisition-channel'
                          label={t('acquisition_channel')}
                          labelId='acquisition-channel-select'
                          onChange={(e) => onChange(Number(e.target.value))}
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
    </>
  );
};

export default CustomerEditDialog;
