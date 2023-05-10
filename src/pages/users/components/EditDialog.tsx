// ** React Imports
import { useState, useEffect } from 'react';
import { useAppSelector } from 'src/hooks/redux';

// ** Interfaces and Models Imports
import { IUpdateUser } from 'src/interfaces/user/update';
import { IGroupedPermission } from 'src/interfaces/user/groupedPermission';
import { MPermission } from 'src/models/user/permission';

// ** MUI Imports
import { Button, TextField, FormControl, FormControlLabel, FormHelperText, IconButton, Typography, DialogTitle } from '@mui/material';
import { Checkbox, Dialog, DialogActions, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import CloseIcon from 'mdi-material-ui/Close';

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { updateSchema } from 'src/schemes/user';

/**
 * Component props
 */
interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: IUpdateUser) => void;
  onClose: () => void;
}

/**
 * Add and edit user form
 * @param props component parameters
 * @returns User Form Dialog component
 */
const UserEditDialog = (props: IProps) => {
  const { t } = useTranslation()
  // ** Props
  const { open, loading, onSubmit, onClose } = props;
  // ** Reducers
  const { roleReducer: { roles }, userReducer: { currentUser } } = useAppSelector((state) => state);
  // ** Vars
  const [groupedPermissions, setGroupedPermissions] = useState<IGroupedPermission>({});

  const defaultValues: IUpdateUser = {
    name: currentUser!.name,
    username: currentUser!.username,
    email: currentUser!.email,
    password: '',
    role_id: currentUser!.roleId,
    status: currentUser!.status,
    permissions: currentUser!.permissions.map(permission => permission.name)
  }

  const schema = updateSchema

  /**
   * Form
   */
  const {
    reset,
    resetField,
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const watchRoleId = watch('role_id')

  useEffect(() => {
    setGroupedPermissions({...groupPermissions(watchRoleId)});
  }, [watchRoleId]);

  useEffect(() => {
    setGroupedPermissions({...groupPermissions(currentUser?.roleId)});
  }, [currentUser]);

  useEffect(() => {
    const currentRole = roles.find(role => role.id == watchRoleId);
    const userPermissions = currentUser?.permissions.map(permission => permission.name);
    const rolesPermissions = currentRole?.permissions.map(permission => permission.name);
    resetField('permissions', {
      defaultValue: userPermissions?.filter(permission => rolesPermissions?.includes(permission))
    });
  }, [groupedPermissions])

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

  /**
   * Form handlers
   */

  /**
   * Utils functions
   */

  /**
   * Group permissions by role
   * @param roleId role to group permissions from
   * @returns grouped permissions by role
   */
  const groupPermissions = (roleId: number | undefined = watchRoleId) => {
    const currentRole = roles.find(role => role.id == roleId);
    const grouped = currentRole?.permissions.reduce((previous: IGroupedPermission, current: MPermission) => {
      previous[current.permissionGroup.name] = previous[current.permissionGroup.name] || [];
      previous[current.permissionGroup.name].push(current);
      return previous;
    }, {})
    return grouped;
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
          { t('user_edit') }
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
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{ t(`${errors.name.message}`) }</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='username'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('username')}
                    onChange={onChange}
                    error={Boolean(errors.username)}
                  />
                )}
              />
              {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{ t(`${errors.username.message}`) }</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label={t('email')}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{ t(`${errors.email.message}`) }</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='password'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type={'password'}
                    value={value}
                    label={t('password')}
                    onChange={onChange}
                    error={Boolean(errors.password)}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='role_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    disableClearable
                    id="select-role"
                    options={roles}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label={t('role')} />}
                    onChange={(_, data) => {onChange(data?.id)}}
                    value={roles.find(role => role.id == value)}
                  />
                )}
              />
              {errors.role_id && <FormHelperText sx={{ color: 'error.main' }}>{ t(`${errors.role_id.message}`) }</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={t('status')}
                    control={<Checkbox {...field} checked={field.value} />}
                  />
                )}
              />
            </FormControl>

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
                  <Controller
                    name='permissions'
                    control={control}
                    render={({ field }) => (
                      <>
                        {Object.entries(groupedPermissions).map(([group, permissions]) => (
                          <TableRow key={group}>
                            <TableCell>
                              <Typography variant='subtitle1'>{group}</Typography>
                              {permissions.map(permission => {
                                return <FormControlLabel
                                  key={permission.id}
                                  label={permission.description} 
                                  control={
                                    <Checkbox
                                      size='small'
                                      value={permission.name}
                                      checked={field.value?.includes(permission.name)}
                                      onChange={(event, checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...field.value as string[],
                                            event.target.value
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value?.filter(
                                              (value) => value !== event.target.value
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  } 
                                />
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>
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

export default UserEditDialog;
