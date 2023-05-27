// ** React Imports
import { SyntheticEvent, useState } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** MUI Imports
import { Button, IconButton, Grid, DialogTitle, Typography, Divider } from '@mui/material';
import { Box, Dialog, DialogContent } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';

// ** Interfaces and Models Imports

// ** Icons Imports
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import CloseIcon from 'mdi-material-ui/Close';
import FileCloudOutlineIcon from 'mdi-material-ui/FileCloudOutline';
import FileCogOutlineIcon from 'mdi-material-ui/FileCogOutline';

// ** Third Party Imports
import { t } from 'i18next';
import Tab from 'src/components/mui/Tab';

interface IProps {
  open: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Brand Details Dialog
 * @param props component parameters
 * @returns Brand Detail Dialog component
 */
const BrandDetailDialog = (props: IProps) => {
  // ** Props
  const { open, onEditClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { brandReducer: { currentBrand } } = useAppSelector((state) => state);
  // ** Vars
  const [ tabValue, setTabValue ] = useState<string>('subcategories');

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
          {t('brand_data')}
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
                      {t('name')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentBrand?.name}</Typography>
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
                  <Tab value='multimedia' label={t('multimedia')} icon={<FileCloudOutlineIcon sx={{ fontSize: '18px' }} />} />
                  <Tab value='parameters' label={t('parameters')} icon={<FileCogOutlineIcon sx={{ fontSize: '18px' }} />} />
                </TabList>
                <Box sx={{ mt: 3 }}>
                  <TabPanel sx={{ p: 0 }} value='multimedia'>
                    {/*
                      START BRAND MULTIMEDIA
                    */}
                    {/*
                      END BRAND MULTIMEDIA
                    */}
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='parameters'>
                    {/*
                      START BRAND PARAMETES
                    */}
                    {/*
                      END BRAND PARAMETES
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

export default BrandDetailDialog;
