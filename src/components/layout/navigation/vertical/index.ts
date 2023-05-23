// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline';
import AccountCircleIcon from 'mdi-material-ui/AccountCircle';
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
      title: i18n.t('customers'),
      icon: AccountCircleIcon,
      path: '/customers',
      action: 'view',
      subject: 'customer'
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
          title: i18n.t('currencies'),
          path: '/configuration/currencies',
          action: 'view',
          subject: 'currency',
        },
        {
          title: i18n.t('warehouses'),
          path: '/configuration/warehouses',
          action: 'view',
          subject: 'warehouse',
        },
        {
          title: i18n.t('customers'),
          children: [
            {
              title: i18n.t('categories'),
              path: '/configuration/customers/categories',
              action: 'view',
              subject: 'customer_category',
            },
            {
              title: i18n.t('acquisition_channels'),
              path: '/configuration/customers/acquisition-channels',
              action: 'view',
              subject: 'acquisition_channel',
            },
            {
              title: i18n.t('reference_types'),
              path: '/configuration/customers/reference-types',
              action: 'view',
              subject: 'customer_reference_type',
            }
          ]
        },
        {
          title: i18n.t('products'),
          children: [
            {
              title: i18n.t('categories'),
              path: '/configuration/products/categories',
              action: 'view',
              subject: 'product_category',
            },
            {
              title: i18n.t('brands'),
              path: '/configuration/products/brands',
              action: 'view',
              subject: 'brand',
            },
            {
              title: i18n.t('measurement_units'),
              path: '/configuration/products/measurement-units',
              action: 'view',
              subject: 'measurement_unit',
            },
            {
              title: i18n.t('properties'),
              path: '/configuration/products/properties',
              action: 'view',
              subject: 'property',
            },
            {
              title: i18n.t('variants'),
              path: '/configuration/products/variants',
              action: 'view',
              subject: 'variant',
            }
          ]
        }
      ]
    },
  ]
};

export default navigation;
