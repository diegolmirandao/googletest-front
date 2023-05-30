// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** MUI Imports
import { DataGridPro, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { Button, IconButton, Grid, DialogTitle, Typography, Divider, Tooltip } from '@mui/material';
import { Box, Dialog, DialogContent } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';

// ** Interfaces and Models Imports
import { MPointOfSale } from 'src/models/pointOfSale';

// ** Icons Imports
import PencilOutlineIcon from 'mdi-material-ui/PencilOutline';
import DeleteOutlineIcon from 'mdi-material-ui/DeleteOutline';
import PlusIcon from 'mdi-material-ui/Plus';
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import CloseIcon from 'mdi-material-ui/Close';
import FileTreeOutlineIcon from 'mdi-material-ui/FileTreeOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';
import CashRegisterIcon from 'mdi-material-ui/CashRegister';

// ** Third Party Imports
import { t } from 'i18next';
import Tab from 'src/components/mui/Tab';
import { setDataGridLocale } from 'src/utils/common';

interface IProps {
  open: boolean;
  onEditClick: () => void;
  onPointOfSaleAddClick: () => void;
  onPointOfSaleEditClick: (pointofsale: MPointOfSale) => void;
  onPointOfSaleDeleteClick: (pointofsale: MPointOfSale) => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Product Establishment Details Dialog
 * @param props component parameters
 * @returns Product Establishment Detail Dialog component
 */
const EstablishmentDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onDeleteClick, onPointOfSaleAddClick, onPointOfSaleEditClick, onPointOfSaleDeleteClick, onClose } = props;
  // ** Reducers
  const { establishmentReducer: { currentEstablishment } } = useAppSelector((state) => state);
  // ** Vars
  const [ tabValue, setTabValue ] = useState<string>('pointsOfSale');

  /**
   * Action buttons column service prices table
   */
  const columns = [
    {
      flex: 0.45,
      minWidth: 130,
      field: 'number',
      headerName: String(t('number'))
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: String(t('actions')),
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem icon={<Tooltip title={t('edit')}><PencilOutlineIcon /></Tooltip>} onClick={() => onPointOfSaleEditClick(row)} label={t('edit')} />,
        <GridActionsCellItem icon={<Tooltip title={t('delete')}><DeleteOutlineIcon /></Tooltip>} onClick={() => onPointOfSaleDeleteClick(row)} label={t('delete')} />
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

  /**
   * Tab change event handler
   * @param event tab change event
   * @param newValue new selected tab
   */
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
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
          {t('establishment_data')}
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
            <Grid item xs={12} md={6} lg={3}>
              {/*
                START DETAILS
              */}
              <Box>
                <Typography variant='h5'>{t('details')}</Typography>
                <Divider sx={{ mt: 4 }} />
                <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('business')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentEstablishment?.business.name}</Typography>
                  </Box>
                </Box>
                <Box sx={{ pt: 2, pb: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('name')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentEstablishment?.name}</Typography>
                  </Box>
                </Box>
              </Box>
              {/*
                END DETAILS
              */}
            </Grid>
            <Grid item xs={12} md={6} lg={9} >
              <TabContext value={tabValue}>
                <TabList
                  onChange={handleTabChange}
                >
                  <Tab value='pointsOfSale' label={t('points_of_sale')} icon={<CashRegisterIcon sx={{ fontSize: '18px' }} />} />
                  <Tab value='parameters' label={t('parameters')} icon={<FileCogOutlineIcon sx={{ fontSize: '18px' }} />} />
                </TabList>
                <Box sx={{ mt: 3 }}>
                  <TabPanel sx={{ p: 0 }} value='pointsOfSale'>
                    {/*
                      START POINTSOFSALE
                    */}
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                      <Box sx={{ display: {xs: 'none', md: 'inline-flex'}, mb: 2}}>
                          <Button sx={{ mr: 2 }} onClick={onPointOfSaleAddClick} variant='outlined' color='primary' startIcon={<PlusIcon fontSize='small' />}>
                            {t('add')}
                          </Button>
                      </Box>
                      <Box sx={{ display: {xs: 'inline-flex', md: 'none'}, mr:4, my: 2 }}>
                          <Button sx={{ mr: 2 }} onClick={onPointOfSaleAddClick} color='primary' variant='outlined'><PlusIcon fontSize='small'/></Button>
                      </Box>
                    </Box>
                    <DataGridPro
                      columns={columns} 
                      rows={currentEstablishment?.pointsOfSale ?? []} 
                      localeText={setDataGridLocale()}
                      disableColumnMenu={true}
                      hideFooterRowCount
                      hideFooterSelectedRowCount
                      disableRowSelectionOnClick
                    />
                    {/*
                      END POINTSOFSALE
                    */}
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='parameters'>
                    {/*
                      START PRODUCT ESTABLISHMENT PARAMETES
                    */}
                    {/*
                      END PRODUCT ESTABLISHMENT PARAMETES
                    */}
                  </TabPanel>
                </Box>
              </TabContext>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default EstablishmentDetailDialog;
