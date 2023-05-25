// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** MUI Imports
import { DataGridPro, GridActionsCellItem, GridRowParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { Button, IconButton, Grid, DialogTitle, Typography, Divider, Tooltip } from '@mui/material';
import { Box, Dialog, DialogContent } from '@mui/material';

// ** Interfaces and Models Imports
import { MVariantOption } from 'src/models/product/variantOption';

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
import Chip from 'src/components/mui/chip';
import { formatNumber } from 'src/utils/format';

interface IProps {
  open: boolean;
  onEditClick: () => void;
  onOptionAddClick: () => void;
  onOptionEditClick: (option: MVariantOption) => void;
  onOptionDeleteClick: (option: MVariantOption) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Product Variant Details Dialog
 * @param props component parameters
 * @returns Product Variant Detail Dialog component
 */
const VariantDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onDeleteClick, onOptionAddClick, onOptionEditClick, onOptionDeleteClick, onClose } = props;
  // ** Reducers
  const { variantReducer: { currentVariant } } = useAppSelector((state) => state);
  // ** Vars

  /**
   * Details datagrid columns definition
   */
  const columns = [
    {
      flex: 0.45,
      minWidth: 130,
      field: 'name',
      headerName: String(t('option'))
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'equivalentAmount',
      headerName: String(t('equivalent_amount')),
      valueFormatter: ({ value }: GridValueFormatterParams) => formatNumber(value)
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'equivalentVariantOption',
      headerName: String(t('equivalent_to')),
      valueGetter: ({ row }: GridValueGetterParams) => row.equivalentOption?.name
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
          {t('variant_data')}
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
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentVariant?.name}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant='subtitle1' sx={{ mr: 2 }}>
                  {t('has_amount_equivalencies')}:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Chip
                      skin='light'
                      size='small'
                      label={currentVariant?.hasAmountEquivalencies ? t('yes') : t('no')}
                      color={currentVariant?.hasAmountEquivalencies ? 'success' : 'error'}
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
                  <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentVariant?.subcategories.map((subcategory) => (<Chip sx={{margin: 1}} label={subcategory.name} />))}</Typography>
                </Box>
              </Box>
              {/*
                END DETAILS
              */}
            </Grid>
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
                autoHeight
                columns={columns} 
                rows={currentVariant?.options ?? []} 
                localeText={setDataGridLocale()}
                disableColumnMenu={true}
                columnVisibilityModel={{
                  equivalentAmount: !!currentVariant?.hasAmountEquivalencies,
                  equivalentVariantOption: !!currentVariant?.hasAmountEquivalencies
                }}
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default VariantDetailDialog;
