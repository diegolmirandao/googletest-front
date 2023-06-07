// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline';
import CashMultipleIcon from 'mdi-material-ui/CashMultiple';
import FileDocumentMultipleOutlineIcon from 'mdi-material-ui/FileDocumentMultipleOutline';
import FileAccountOutlineIcon from 'mdi-material-ui/FileAccountOutline';
import AccountCashOutlineIcon from 'mdi-material-ui/AccountCashOutline';
import TruckIcon from 'mdi-material-ui/Truck';
import CartIcon from 'mdi-material-ui/Cart';
import AccountCircleIcon from 'mdi-material-ui/AccountCircle';
import WarehouseIcon from 'mdi-material-ui/Warehouse';
import AccountIcon from 'mdi-material-ui/Account';
import CogOutlineIcon from 'mdi-material-ui/CogOutline';
import i18n from 'i18next';

// ** Type import
import { VerticalNavItemsType } from '../../../../types/Layout';

const navigation = (tenantDomain: string): VerticalNavItemsType => {
  return [
    {
      title: i18n.t('home'),
      icon: HomeOutline,
      path: `/${tenantDomain}`,
      action: 'view',
      subject: 'home'
    },
    {
      title: i18n.t('customers'),
      icon: AccountCircleIcon,
      path: `/${tenantDomain}/customers`,
      action: 'view',
      subject: 'customer'
    },
    {
      title: i18n.t('sales'),
      icon: CashMultipleIcon,
      path: `/${tenantDomain}/sales`,
      action: 'view',
      subject: 'sale'
    },
    {
      title: i18n.t('sale_orders'),
      icon: FileDocumentMultipleOutlineIcon,
      path: `/${tenantDomain}/sale-orders`,
      action: 'view',
      subject: 'sale_order'
    },
    {
      title: i18n.t('accounts_receivable'),
      icon: FileAccountOutlineIcon,
      path: `/${tenantDomain}/accounts-receivable`,
      action: 'view',
      subject: 'sale'
    },
    {
      title: i18n.t('customer_payments'),
      icon: AccountCashOutlineIcon,
      path: `/${tenantDomain}/customer-payments`,
      action: 'view',
      subject: 'sale_payment'
    },
    {
      title: i18n.t('suppliers'),
      icon: TruckIcon,
      path: `/${tenantDomain}/suppliers`,
      action: 'view',
      subject: 'supplier'
    },
    {
      title: i18n.t('purchases'),
      icon: CartIcon,
      path: `/${tenantDomain}/purchases`,
      action: 'view',
      subject: 'purchase'
    },
    {
      title: i18n.t('accounts_payable'),
      icon: FileAccountOutlineIcon,
      path: `/${tenantDomain}/accounts-payable`,
      action: 'view',
      subject: 'purchase'
    },
    {
      title: i18n.t('supplier_payments'),
      icon: AccountCashOutlineIcon,
      path: `/${tenantDomain}/supplier-payments`,
      action: 'view',
      subject: 'purchase_payment'
    },
    {
      title: i18n.t('products'),
      icon: WarehouseIcon,
      path: `/${tenantDomain}/products`,
      action: 'view',
      subject: 'product'
    },
    {
      title: i18n.t('users'),
      icon: AccountIcon,
      path: `/${tenantDomain}/users`,
      action: 'view',
      subject: 'user'
    },
    {
      title: i18n.t('configuration'),
      icon: CogOutlineIcon,
      children: [
        {
          title: i18n.t('currencies'),
          path: `/${tenantDomain}/configuration/currencies`,
          action: 'view',
          subject: 'currency',
        },
        {
          title: i18n.t('businesses'),
          path: `/${tenantDomain}/configuration/businesses`,
          action: 'view',
          subject: 'business',
        },
        {
          title: i18n.t('establishments'),
          path: `/${tenantDomain}/configuration/establishments`,
          action: 'view',
          subject: 'establishment',
        },
        {
          title: i18n.t('warehouses'),
          path: `/${tenantDomain}/configuration/warehouses`,
          action: 'view',
          subject: 'warehouse',
        },
        {
          title: i18n.t('customers'),
          children: [
            {
              title: i18n.t('categories'),
              path: `/${tenantDomain}/configuration/customers/categories`,
              action: 'view',
              subject: 'customer_category',
            },
            {
              title: i18n.t('acquisition_channels'),
              path: `/${tenantDomain}/configuration/customers/acquisition-channels`,
              action: 'view',
              subject: 'acquisition_channel',
            },
            {
              title: i18n.t('reference_types'),
              path: `/${tenantDomain}/configuration/customers/reference-types`,
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
              path: `/${tenantDomain}/configuration/products/categories`,
              action: 'view',
              subject: 'product_category',
            },
            {
              title: i18n.t('brands'),
              path: `/${tenantDomain}/configuration/products/brands`,
              action: 'view',
              subject: 'brand',
            },
            {
              title: i18n.t('measurement_units'),
              path: `/${tenantDomain}/configuration/products/measurement-units`,
              action: 'view',
              subject: 'measurement_unit',
            },
            {
              title: i18n.t('price_types'),
              path: `/${tenantDomain}/configuration/products/price-types`,
              action: 'view',
              subject: 'product_price_type',
            },
            {
              title: i18n.t('cost_types'),
              path: `/${tenantDomain}/configuration/products/cost-types`,
              action: 'view',
              subject: 'product_cost_type',
            },
            {
              title: i18n.t('properties'),
              path: `/${tenantDomain}/configuration/products/properties`,
              action: 'view',
              subject: 'property',
            },
            {
              title: i18n.t('variants'),
              path: `/${tenantDomain}/configuration/products/variants`,
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
