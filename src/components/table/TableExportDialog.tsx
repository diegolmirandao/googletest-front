// ** React Imports
import { useState } from "react";

// ** Interfaces and Types Imports
import { ITableExportColumn } from 'src/interfaces/tableExportColumn';
import { SectionType } from 'src/types/sectionType';

// ** MUI Imports
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { Box, Checkbox, FormControlLabel, IconButton, Radio, RadioGroup, Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import ExportVariantIcon from 'mdi-material-ui/ExportVariant';
import CloseIcon from 'mdi-material-ui/Close';

/**
 * Component props
 */
interface IProps {
    open: boolean;
    section: SectionType;
    columns: ITableExportColumn[];
    onClose: () => void;
}

/**
 * Table column selection component for exporting
 * @param props component parameters
 * @returns Table Export dialog component
 */
const TableExportDialog = (props: IProps) => {
  // ** Props
  const { open, section, columns, onClose } = props;
  // ** Vars
  const [loading, setLoading] = useState<boolean>(false);
  const [exportType, setExportType] = useState<string>('pdf')

  /**
   * Handle submit event, export data
   */
  const handleSubmit = async () => {
    // setLoading(true)
    // try {
    //   await dispatch(deleteUserAction(userReducer.currentUser?.id)).then(unwrapResult)
    //   dispatch(setCurrentUser(undefined))
    //   toast.success('Usuario eliminado correctamente')
    // } catch (error) {
    //   toast.error('Error eliminando usuario')
    // }
    // setLoading(false)
  };

  /**
   * Handler when the dialog requests to be closed
   * @param event The event source of the callback
   * @param reason Can be: "escapeKeyDown", "backdropClick"
   */
  const handleClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth='sm'
        scroll='body'
        disableEscapeKeyDown
        onClose={handleClose}
      >
        <DialogTitle>EXPORTAR DATOS</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <IconButton
                size='small'
                onClick={onClose}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
              <CloseIcon />
            </IconButton>
            <Box>
              <RadioGroup row value={exportType} name='export-type-radio' onChange={(e) => setExportType(e.target.value)} aria-label='export-type-radio'>
                <FormControlLabel value='pdf' control={<Radio />} label='PDF' />
                <FormControlLabel value='excel' control={<Radio />} label='EXCEL' />
              </RadioGroup>
              <Typography variant='subtitle1'>Columnas</Typography>
              {columns.map(column => {
                return <FormControlLabel
                  key={column.field}
                  label={column.text}
                  sx={{ display: 'block' }}
                  control={<Checkbox 
                      size='small'
                      checked={true}
                    />
                  } 
                />
              })}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<ExportVariantIcon />} onClick={handleSubmit} loading={loading}>
            Exportar
          </LoadingButton>
          <Button size='large' variant='outlined' color='secondary' onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default TableExportDialog;
