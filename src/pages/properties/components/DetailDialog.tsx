// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** MUI Imports
import { DataGridPro, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid-pro';
import { Button, IconButton, Grid, DialogTitle, Typography, Divider, Tooltip } from '@mui/material';
import { Box, Dialog, DialogContent } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';

// ** Interfaces and Models Imports
import { MPropertyOption } from 'src/models/product/propertyOption';

// ** Icons Imports
import PencilOutlineIcon from 'mdi-material-ui/PencilOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import PlusIcon from 'mdi-material-ui/Plus';
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { t } from 'i18next';
import { setDataGridLocale } from 'src/utils/common';
import { EPropertyType } from 'src/enums/propertyType';
import { PropertyTypeType } from 'src/types/propertyTypeType';
import Chip from 'src/components/mui/chip';

interface IProps {
  open: boolean;
  onEditClick: () => void;
  onOptionAddClick: () => void;
  onOptionEditClick: (option: MPropertyOption) => void;
  onOptionDeleteClick: (option: MPropertyOption) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Product Property Details Dialog
 * @param props component parameters
 * @returns Product Property Detail Dialog component
 */
const PropertyDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onDeleteClick, onOptionAddClick, onOptionEditClick, onOptionDeleteClick, onClose } = props;
  // ** Reducers
  const { propertyReducer: { currentProperty } } = useAppSelector((state) => state);
  // ** Vars

  /**
   * Details datagrid columns definition
   */
  const columns = [
    {
      flex: 0.45,
      minWidth: 130,
      field: 'value',
      headerName: String(t('option'))
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('edit')}><PencilOutlineIcon /></Tooltip>} onClick={() => onOptionEditClick(row)} label={t('edit')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => onOptionDeleteClick(row)} label={t('delete')} />
      ]
    }
  ];

  /**
   * Handler when the dialog requests to be closed
   * @param event The event source of the callback
   * @param reason Can be: "escapeKeyDown", "backdropClick"
   */
  const handleDialogClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
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
          {t('property_data')}
          <IconButton
            size='small'
            onClick={onClose}
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
          <Grid container spacing={6}>
            <Grid item xs>
              {/*
                START DETAILS
              */}
              <Box>
                <Typography variant='h5'>{t('details')}</Typography>
                <Divider sx={{ mt: 4 }} />
                <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('name')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentProperty?.name}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('type')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{t(EPropertyType[currentProperty?.type as PropertyTypeType])}</Typography>
                  </Box>
                </Box>
                {currentProperty?.type == 'numeric' &&
                  <Box sx={{ pt: 2, pb: 1 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant='subtitle1' sx={{ mr: 2 }}>
                        {t('measurement_unit')}:
                      </Typography>
                      <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentProperty?.measurementUnit?.name}</Typography>
                    </Box>
                  </Box>
                }
                <Box sx={{ mb: 1 }}>
                  <Typography variant='subtitle1' sx={{ mr: 2 }}>
                    {t('property_can_have_more_than_one_value_at_once')}:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                      <Chip
                        skin='light'
                        size='small'
                        label={currentProperty?.hasMultipleValues ? t('yes') : t('no')}
                        color={currentProperty?.hasMultipleValues ? 'success' : 'error'}
                        sx={{
                            height: 24,
                            fontSize: '16px',
                            fontWeight: 400,
                            borderRadius: '5px',
                            textTransform: 'capitalize'
                        }}
                      />
                  </Box>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant='subtitle1' sx={{ mr: 2 }}>
                    {t('is_required_field')}:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                      <Chip
                        skin='light'
                        size='small'
                        label={currentProperty?.isRequired ? t('yes') : t('no')}
                        color={currentProperty?.isRequired ? 'success' : 'error'}
                        sx={{
                            height: 24,
                            fontSize: '16px',
                            fontWeight: 400,
                            borderRadius: '5px',
                            textTransform: 'capitalize'
                        }}
                      />
                  </Box>
                </Box>
                <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('subcategories')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentProperty?.subcategories.map((subcategory) => (<Chip sx={{margin: 1}} label={subcategory.name} />))}</Typography>
                  </Box>
                </Box>
              {/*
                END DETAILS
              */}
            </Grid>
            {currentProperty?.type == 'list' &&
              <Grid item xs={12} md={6} lg={8} >
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                  <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                      <Button sx={{ mr: 2 }} onClick={onOptionAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                      {t('add')}
                      </Button>
                  </Box>
                  <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                      <Button sx={{ mr: 2 }} onClick={onOptionAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                  </Box>
                </Box>
                <DataGridPro
                  columns={columns} 
                  rows={currentProperty?.options ?? []} 
                  localeText={setDataGridLocale()}
                  disableColumnMenu={true}
                  hideFooterSelectedRowCount
                  disableRowSelectionOnClick
                  sx={{ maxHeight: '50vh' }}
                />
              </Grid>
            }
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default PropertyDetailDialog;
