// ** React Imports
import { useEffect, useState } from 'react';

// ** Interfaces and Models Imports
import { IAddVariant } from 'src/interfaces/product/addVariant';

// ** MUI Imports
import { Button, TextField, FormControl, FormHelperText, IconButton, DialogTitle, Grid, Typography, Autocomplete, InputLabel, styled, lighten, darken, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import DeleteIcon from 'mdi-material-ui/Delete';
import PlusIcon from 'mdi-material-ui/Plus';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';

// ** Third Party Imports
import { t } from 'i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useAppSelector } from 'src/hooks/redux';
import { DataGridPro, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { setDataGridLocale } from 'src/utils/common';
import { IAddUpdateVariantOption } from 'src/interfaces/product/addUpdateVariantOption';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IAddVariant) => void;
  onClose: () => void;
}

interface ISelectedOption extends IAddUpdateVariantOption {
  index: number;
  id: string;
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

/**
 * Add and edit measurement unit form
 * @param props component parameters
 * @returns Variant Form Dialog component
 */
const VariantAddDialog = (props: IProps) => {
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { measurementUnitReducer: { measurementUnits }, productCategoryReducer: { productCategories } } = useAppSelector((state) => state);
  // ** Vars
  const [newOption, setNewOption] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [showMeasurementUnitField, setShowMeasurementUnitField] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<ISelectedOption[]>([]);
  const productSubcategories = productCategories.map(category => category.subcategories).flat();
  const defaultValues: IAddVariant = {
    name: '',
    has_amount_equivalencies: false,
    subcategories: [],
    options: []
  };

  /**
   * Action buttons column service prices table
   */
  const columns = [
    {
      flex: 0.45,
      minWidth: 130,
      field: 'name',
      headerName: String(t('option'))
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => optionRemove(row.index)} label={t('delete')} />
      ]
    }
  ];

  /**
   * Form validation schema
   */
  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  /**
   * Form
   */
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const {
    fields: optionFields,
    append: optionAppend,
    update: optionUpdate,
    remove: optionRemove
  } = useFieldArray({
    control,
    name: "options"
  });

  useEffect(() => {
    setSelectedOptions(optionFields.map((option, index) => ({ index: index, id: option.id, name: option.name })))
  }, [optionFields]);

  /**
   * Handle new variant add event
   */
  const handleNewOptionAdd = () => {
    optionAppend({ name: newOption });
    setNewOption('');
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
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('add_variant')}
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
            <Grid container spacing={6}>
              <Grid item xs>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label={t('name')}
                        onChange={onChange}
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.name.message}`)}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name="has_amount_equivalencies"
                    control={control}
                    render={({ field }) => (
                    <FormControlLabel
                      label={t('has_amount_equivalencies')}
                      control={<Checkbox {...field} checked={Boolean(field.value)} />}
                    />
                    )}
                  />
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Controller
                    name='subcategories'
                    control={control}
                    render={({ field: { value } }) => (
                      <Autocomplete
                        multiple
                        openOnFocus
                        options={productSubcategories}
                        disableCloseOnSelect
                        limitTags={5}
                        getOptionLabel={option => option.name}
                        groupBy={(option) => String(option.productCategoryId)}
                        renderGroup={(params) => (
                          <li key={params.key}>
                            <GroupHeader>{productCategories.find(category => category.id === Number(params.group))?.name}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                          </li>
                        )}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        )}
                        onChange={(_, data) => {setValue('subcategories', data.map(value => Number(value.id)))}}
                        renderInput={params => <TextField {...params} label={t('subcategories')} sx={{ mb: 3 }} />}
                      />
                    )}
                  />
                  {errors.subcategories && <FormHelperText sx={{ color: 'error.main' }}>{t(`${errors.subcategories.message}`)}</FormHelperText>}
                </FormControl>
              </Grid>

              {showOptions && <Grid item xs={12} md={6} lg={8}>
                <Typography variant='h5' sx={{ mb: 3, textTransform: 'capitalize' }}>{t('options')}</Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <TextField
                    label={t('add_option')}
                    size='small'
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {if(e.key == 'Enter'){e.preventDefault();handleNewOptionAdd();}}}
                  />
                </FormControl>

                <DataGridPro
                  columns={columns} 
                  rows={selectedOptions} 
                  localeText={setDataGridLocale()}
                  disableColumnMenu={true}
                  hideFooterSelectedRowCount
                  disableRowSelectionOnClick
                  sx={{height: '40vh'}}
                />
              </Grid>}
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
    </>
  )
};

export default VariantAddDialog;
