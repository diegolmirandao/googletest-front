// ** React Imports
import { ElementType, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from '../../../../config/themeConfig'

// ** Types
import { NavLink } from '../../../../types/Layout'
import { Settings } from '../../../../context/settingsContext'

// ** Custom Components Imports
import UserIcon from '../../UserIcon'
import Translations from '../../Translations'
import CanViewNavLink from '../../acl/CanViewNavLink'

// ** Util Import
import { hexToRGBA } from '../../../../utils/hex-to-rgba'

import { Link } from 'react-router-dom'
import { useLocation, useParams } from 'react-router-dom'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<ListItemProps & { component?: ElementType; target?: '_blank' | undefined }>(
  ({ theme }) => ({
    width: 'auto',
    paddingTop: theme.spacing(2.25),
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(2.25),
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.active, &.active:hover': {
      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
    },
    '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    }
  })
)

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props

  // ** Hook & Vars
  const { pathname, search } = useLocation()
  const params = useParams()
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const IconTag = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  const handleURLQueries = () => {
    if (Object.keys(params).length && item.path) {
      const arr = Object.keys(params)
      const fullpath = pathname+search

      return fullpath.includes(item.path) && fullpath.includes(params[arr[0]] as string)
    }
  }

  const isNavLinkActive = () => {
    if (pathname === item.path || handleURLQueries()) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <ListItem
          component={Link}
          to={`${item.path}`}
          disabled={item.disabled}
          className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  borderRadius: '8px',
                  '&.active, &.active:hover': {
                    backgroundColor: theme => theme.palette.primary.main,
                    '& .MuiTypography-root, & .MuiListItemIcon-root': {
                      color: 'common.white'
                    }
                  }
                }
              : {})
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' })
              }}
            >
              <ListItemIcon sx={{ mr: hasParent ? 3 : 2.5, color: 'text.primary' }}>
                <UserIcon
                  icon={IconTag}
                  componentType='horizontal-menu'
                  iconProps={{ sx: IconTag === navSubItemIcon ? { fontSize: '0.5rem' } : {} }}
                />
              </ListItemIcon>
              <Typography {...(menuTextTruncate && { noWrap: true })}>
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{ ml: 1.5, '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink