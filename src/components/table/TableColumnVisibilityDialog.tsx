// ** MUI Imports
import { Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { Box, Switch, FormControlLabel, IconButton, Typography, FormControl } from '@mui/material';
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';
import { useEffect } from 'react';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';

/**
 * Component props
 */
interface IProps {
    open: boolean;
    columns: GridColDef[];
    columnVisibility: GridColumnVisibilityModel;
    onClose: () => void;
    onSubmit: (model: GridColumnVisibilityModel) => void;
};

/**
 * 
 * @param props component parameters
 * @returns Table Column Visibility Dialog
 */
const TableColumnVisibilityDialog = (props: IProps) => {
  const { open, columns, columnVisibility, onClose, onSubmit } = props;

  /**
   * Form
   */
  const {
    register,
    watch,
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: columnVisibility,
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch(() => handleSubmit(handleFormSubmit));
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

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

  const handleFormSubmit = (formFields: GridColumnVisibilityModel) => {
    onSubmit(formFields);
  };

  return (
      <>
      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        scroll='body'
        disableEscapeKeyDown
        onClose={handleClose}
      >
        <DialogTitle>VISIBILIDAD</DialogTitle>
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
              <Typography variant='subtitle1'>Columnas</Typography>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {Object.values(columns).map(column => {
                  return <FormControl fullWidth sx={{ mb: 1 }}>
                    <Controller
                      name={column.field}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          label={column.headerName}
                          control={<Switch {...field} checked={field.value} />}
                        />
                      )}
                      />
                  </FormControl>
                })}
              </form>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableColumnVisibilityDialog;