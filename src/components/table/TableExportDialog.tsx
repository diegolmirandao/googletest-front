// ** React Imports
import { useState } from "react";

// ** Interfaces and Types Imports
import { ITableExport, ITableExportColumn } from 'src/interfaces/tableExport';
import { ExportFormatType } from "src/types/ExportFormatType";

// ** MUI Imports
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { Box, Checkbox, FormControlLabel, IconButton, Radio, RadioGroup, Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import ExportVariantIcon from 'mdi-material-ui/ExportVariant';
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";

/**
 * Component props
 */
interface IProps {
    open: boolean;
    loading: boolean;
    columns: ITableExportColumn[];
    defaultExportData?: ITableExport;
    onSubmit: (config: ITableExport) => void;
    onClose: () => void;
}

/**
 * Table column selection component for exporting
 * @param props component parameters
 * @returns Table Export dialog component
 */
const TableExportDialog = (props: IProps) => {
  // ** Props
  const { open, loading, columns, defaultExportData, onSubmit, onClose } = props;
  // ** Vars
  const defaultValues: ITableExport = defaultExportData ?? {
    format: 'pdf',
    columns: columns.map((column) => column.field)
  };

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ITableExport>({
    defaultValues,
    mode: 'onChange',
  });

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
        open={open}
        maxWidth='sm'
        scroll='body'
        disableEscapeKeyDown
        onClose={handleClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          { t('export') }
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
            <DialogContent>
              <Controller
                name='format'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <RadioGroup row value={value} name='export-format-radio' onChange={onChange} aria-label='export-format-radio'>
                    <FormControlLabel value='pdf' control={<Radio />} label='PDF' />
                    <FormControlLabel value='excel' control={<Radio />} label='EXCEL' />
                  </RadioGroup>
                )}
              />
              <Typography variant='subtitle1'>{t('columns')}</Typography>
              <Controller
                name='columns'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {columns.map(column => {
                      return <FormControlLabel
                        key={column.field}
                        label={t(column.text)}
                        sx={{ display: 'block' }}
                        control={<Checkbox 
                            size='small'
                            value={column.field}
                            checked={value?.includes(column.field)}
                            onChange={(event, checked) => {
                              if (checked) {
                                onChange([
                                  ...value as string[],
                                  event.target.value
                                ]);
                              } else {
                                onChange(
                                  value?.filter(
                                    (val) => val !== event.target.value
                                  )
                                );
                              }
                            }}
                          />
                        } 
                      />
                    })}
                  </>
                )}
              />
            </DialogContent>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'right' }}>
            <LoadingButton size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<ExportVariantIcon />} loading={loading}>
              {t('export')}
            </LoadingButton>
            <Button size='large' variant='outlined' color='secondary' onClick={onClose}>
              {t('cancel')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
};

export default TableExportDialog;
