// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import BaseLayout from './BaseLayout'

// ** Navigation Imports
import VerticalNavItems from './navigation/vertical'
import HorizontalNavItems from './navigation/horizontal'

import VerticalAppBarContent from './vertical/AppBarContent'
import HorizontalAppBarContent from './horizontal/AppBarContent'

import FooterContent from './shared-components/footer/FooterContent'

// ** Hook Import
import { useSettings } from '../../hooks/useSettings'
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material'

interface Props {
  children: ReactNode
}

const AppBrand = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 4  }}>
      <img src='/images/logos/logo-blue-mini.png' alt='logo' width='48' height='42' />
      <Typography variant='h4' sx={{ ml: 2, fontWeight: 600, letterSpacing: 8 }}>
        CADI
      </Typography>
    </Box>
  )
}

const Layout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { tenantDomain } = useParams();

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  return (
    <BaseLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      {...(settings.layout === 'horizontal'
          ? { horizontalAppBarBranding: () => <AppBrand /> }
          : { verticalNavMenuBranding: () => <AppBrand /> })}
      {...(settings.layout === 'horizontal'
        ? {
            // ** Navigation Items
            horizontalNavItems: HorizontalNavItems(),

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // horizontalNavItems: ServerSideHorizontalNavItems(),

            // ** AppBar Content
            horizontalAppBarContent: () => (
              <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
            )
          }
        : {
            // ** Navigation Items
            verticalNavItems: VerticalNavItems(tenantDomain!),

            // Uncomment the below line when using server-side menu in vertical layout and comment the above line
            // verticalNavItems: ServerSideVerticalNavItems(),

            // ** AppBar Content
            verticalAppBarContent: props => (
              <VerticalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                toggleNavVisibility={props.toggleNavVisibility}
              />
            )
          })}
      footerContent={FooterContent}
    >
      {children}
    </BaseLayout>
  )
}

export default Layout
