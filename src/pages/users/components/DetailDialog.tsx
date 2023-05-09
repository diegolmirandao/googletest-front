// ** React Imports
import { useState, useEffect } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** MUI Imports
import { Button, TextField, FormControl, IconButton, Typography, DialogTitle, Grid, Divider } from '@mui/material';
import { Box, Checkbox, Dialog, DialogContent, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CustomChip from 'src/components/mui/chip';

// ** Interfaces and Models Imports
import { IGroupedPermission } from 'src/interfaces/user/groupedPermission';
import { MPermission } from 'src/models/user/permission';

// ** Icons Imports
import PencilIcon from 'mdi-material-ui/Pencil';
import DeleteIcon from 'mdi-material-ui/Delete';
import CloseIcon from 'mdi-material-ui/Close';
import { useTranslation } from 'react-i18next';

interface IProps {
  open: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onClose: () => void;
}

/**
 * Users Detail Dialog
 * @param props component parameters
 * @returns User Detail Dialog component
 */
const UserDetailDialog = (props: IProps) => {
  const { t } = useTranslation()
  // ** Props
  const { open, onEditClick, onDeleteClick, onClose } = props;
  // ** Reducers
  const { roleReducer: { roles }, userReducer: { currentUser } } = useAppSelector((state) => state);
  // ** Vars
  const [groupedPermissions, setGroupedPermissions] = useState<IGroupedPermission>({});

  useEffect(() => {
    if (currentUser) {
      setGroupedPermissions({...groupPermissions()});
    }
  }, [currentUser]);

  /**
   * Group roles permissions
   * @returns grouped permissions
   */
  const groupPermissions = () => {
    const currentRole = roles.find(role => role.id == currentUser?.roleId);
    const grouped = currentRole?.permissions.reduce((previous: IGroupedPermission, current: MPermission) => {
      previous[current.permissionGroup.name] = previous[current.permissionGroup.name] || [];
      previous[current.permissionGroup.name].push(current);
      
      return previous;
    }, {});

    return grouped;
  };

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
        maxWidth='lg'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          {t('user_data')}
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
            <Box sx={{ display: {xs: 'inline-flex', md: 'none'}}}>
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
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentUser?.name}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('username')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentUser?.username}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('email')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentUser?.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('role')}:
                    </Typography>
                    <Typography variant='body1' sx={{ textAlign: 'right' }}>{currentUser?.roles[0].name}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant='subtitle1' sx={{ mr: 2 }}>
                      {t('status')}:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        <CustomChip
                          skin='light'
                          size='small'
                          label={currentUser?.status ? t('active') : t('inactive')}
                          color={currentUser?.status ? 'success' : 'error'}
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
                </Box>
              </Box>
              {/*
                END DETAILS
              */}
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              {/*
                START PERMISSIONS DETAILS
              */}
              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ pl: 0 }}>
                        <Typography variant='h6'>{t('permissions')}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupedPermissions).map(([group, permissions]) => (
                      <TableRow key={group}>
                        <TableCell>
                          <Typography variant='subtitle1'>{group}</Typography>
                          {permissions.map(permission => {
                            const checkedValue = currentUser ? !!currentUser.permissions.find(currentUserPermission => currentUserPermission.id == permission.id) : true

                            return <FormControlLabel
                              key={permission.id}
                              label={permission.description} 
                              control={<Checkbox 
                                  size='small'
                                  checked={checkedValue}
                                />
                              } 
                            />
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/*
                END PERMISSION DETAILS
              */}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default UserDetailDialog;
