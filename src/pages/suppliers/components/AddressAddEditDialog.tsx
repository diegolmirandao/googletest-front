// ** React Imports
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IAddUpdateSupplierAddress } from 'src/interfaces/supplier/addUpdateAddress';

// ** MUI Imports
import { Dialog, DialogContent, DialogActions, FormControl, FormHelperText, DialogTitle, Grid, Autocomplete } from '@mui/material';
import { Button, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';
import { t } from 'i18next';
import Map from 'src/components/misc/map';
import { useEffect } from 'react';
import PhoneInput from 'src/components/inputmask/PhoneInput';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  defaultFormValues?: IAddUpdateSupplierAddress;
  onSubmit: (formFields: IAddUpdateSupplierAddress) => void;
  onClose: () => void;
}

/**
 * Supplier edit dialog
 * @param props component parameters
 * @returns Supplier Edit Dialog component
 */
const SupplierAddressAddEditDialog = (props: IProps) => {
  // ** Props
  const { open, loading, defaultFormValues, onSubmit, onClose } = props;
  // ** Reducers
  const { supplierReducer: { currentSupplierAddress }, countryReducer: { countries } } = useAppSelector((state) => state);
  // ** Vars
  const regions = countries.map(country => country.regions).flat();
  const cities = regions.map(region => region.cities).flat();
  const zones = cities.map(city => city.zones).flat();
  const defaultValues: IAddUpdateSupplierAddress = defaultFormValues ?? {
    city_id: currentSupplierAddress?.city.id ?? 1,
    zone_id: currentSupplierAddress?.zone.id ?? 1,
    name: currentSupplierAddress?.name ?? '',
    phone: currentSupplierAddress?.phone ?? '',
    address: currentSupplierAddress?.address ?? '',
    reference: currentSupplierAddress?.reference ?? '',
    lat: currentSupplierAddress?.lat ?? -25.282109165529942,
    lng: currentSupplierAddress?.lng ?? -57.63505156860886,
  };

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
  } = useForm<IAddUpdateSupplierAddress>({
    defaultValues,
    mode: 'onChange'
  });

  let watchCity = watch('city_id');

  useEffect(() => {
    const newDefaultZone = zones.find(zone => zone.cityId === watchCity && zone.id === defaultValues.zone_id) ?? zones.find(zone => zone.cityId === watchCity);
    setValue('zone_id', newDefaultZone!.id);
  }, [watchCity]);

  /**
   * Map coordenades change event
   * @param coords map new coordenades
   */
  const onCoordsChange = (coords: google.maps.LatLngLiteral) => {
    console.log(coords);
    setValue('lat', coords.lat);
    setValue('lng', coords.lng);
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
      maxWidth='md'
      scroll='body'
      onClose={handleDialogClose}
    >
      <DialogTitle sx={{ position: 'relative' }}>
        {defaultFormValues || currentSupplierAddress ? t('edit_address') : t('add_address')}
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth sx={{ mb: 3 }}>
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

              <FormControl fullWidth sx={{ mb: 3 }}>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      value={value}
                      label={t('phone')}
                      size='small'
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                    />
                  )}
                />
                {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.phone.message}`)}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }} size='small'>
                <Controller
                  name='city_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      disableClearable
                      id="select-city"
                      options={cities}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} size='small' label={t('city')} />}
                      onChange={(_, data) => {onChange(data?.id)}}
                      value={cities.find(city => city.id == value)}
                    />
                  )}
                />
                {errors.city_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.city_id.message}`)}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }} size='small'>
                <Controller
                  name='zone_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      disableClearable
                      id="select-zone"
                      options={zones.filter(zone => zone.cityId == watchCity)}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} size='small' label={t('zone')} />}
                      onChange={(_, data) => {onChange(data?.id)}}
                      value={zones.find(zone => zone.id == value)}
                    />
                  )}
                />
                {errors.zone_id && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.zone_id.message}`)}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    multiline
                    rows={2}
                    label={t('address')}
                    onChange={onChange}
                    error={Boolean(errors.address)}
                  />
                  )}
                />
                {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.address.message}`)}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name='reference'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    multiline
                    rows={2}
                    label={t('references')}
                    onChange={onChange}
                    error={Boolean(errors.address)}
                  />
                  )}
                />
                {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.address.message}`)}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item  xs={12} md={6} lg={8}>
              <Map position={{ lat: getValues('lat'), lng: getValues('lng') }} onCoordsChange={onCoordsChange}></Map>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} loading={loading}>
            {t('save')}
          </LoadingButton>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
          { t('cancel')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierAddressAddEditDialog;
