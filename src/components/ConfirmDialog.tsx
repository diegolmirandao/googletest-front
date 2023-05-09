import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface IProps {
  open: boolean
  title?: string
  message?: string
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

const ConfirmDialog = (props: IProps) => {
  const { open, title, message, loading, onConfirm, onClose } = props
  const { t } = useTranslation()

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
        maxWidth='sm'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle>{title ?? t('confirm_action')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message ?? t('action_confirmation_question')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' color='primary' type='submit' variant='contained' sx={{ mr: 3 }} onClick={onConfirm} loading={loading}>
            { t('confirm') }
          </LoadingButton>
          <Button size='large' variant='outlined' color='secondary' onClick={onClose}>
          { t('cancel') }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default ConfirmDialog;
