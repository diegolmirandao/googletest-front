// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { useAppDispatch } from '../../hooks/redux'
import {unwrapResult} from '@reduxjs/toolkit';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Layout Import
import BlankLayout from '../../components/layout/BlankLayout'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

import { ILogin } from '../../interfaces/user/login'
import FormHelperText from '@mui/material/FormHelperText'
import { loginAction } from '../../redux/actions/auth'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'
import LoadingButton from '@mui/lab/LoadingButton';
import Page from '../../components/Page'
import { displayErrors } from 'src/utils/common'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const defaultValues: ILogin = {
  username: '',
  password: '',
}

const schema = yup.object().shape({
  username: yup.string().required('required_field'),
  password: yup.string().required('required_field')
})

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const auth = useAuth()
  const { t } = useTranslation()

  // ** Hooks
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/')
    }
  }, [])
  

  const onSubmit = async (values: ILogin): Promise<void> => {
    setLoading(true)
    try {
      await dispatch(loginAction(values)).then(unwrapResult)

      navigate('/')
    } catch (error) {
      setLoading(false)
      
      console.log('LOGIN ERROR', error)
      displayErrors(error)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src='/images/logos/logo-blue-mini.png' alt='logo' width='64' height='56' />
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>{t('sigin')}</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label={t('user')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{ t(`${errors.username.message}`) }</FormHelperText>}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  {t('password')}
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label={t('password')}
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    { t(`${errors.password.message}`) }
                  </FormHelperText>
                )}
              </FormControl>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'right', flexWrap: 'wrap', justifyContent: 'flex-end' }} >
                {/* <Link passHref href='/forgot-password'>
                  <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                    Olvidaste la contraseña?
                  </Typography>
                </Link> */}
              </Box>
              <LoadingButton fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} loading={loading}>
                {t('sigin')}
              </LoadingButton>
            </form>
        </CardContent>
      </Card>
    </Box>
  )
}

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Login.guestGuard = true

export default Page(Login)

