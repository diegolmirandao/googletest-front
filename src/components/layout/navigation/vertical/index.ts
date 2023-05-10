// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline';
import AccountIcon from 'mdi-material-ui/Account';
import CogOutlineIcon from 'mdi-material-ui/CogOutline';
import i18n from 'i18next';

// ** Type import
import { VerticalNavItemsType } from '../../../../types/Layout';

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
    {
      title: i18n.t('configuration'),
      icon: CogOutlineIcon,
      children: [
        {
          title: i18n.t('customers'),
          children: [
            {
              title: i18n.t('categories'),
              path: '/configuration/customers/categories',
              action: 'view',
              subject: 'customer_category',
            }
          ]
        }
      ]
    },
  ]
};

export default navigation;
