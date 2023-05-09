// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountIcon from 'mdi-material-ui/Account'
import i18n from 'i18next'

// ** Type import
import { VerticalNavItemsType } from '../../../../types/Layout'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: i18n.t('home'),
      icon: HomeOutline,
      path: '/',
      action: 'view',
      subject: 'home'
    },
    {
      title: i18n.t('users'),
      icon: AccountIcon,
      path: '/users',
      action: 'view',
      subject: 'user'
    },
  ]
}

export default navigation
