// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { HorizontalNavItemsType } from '../../../../../src/types/Layout'

// ** Config Import
import themeConfig from '../../../../config/themeConfig'

// ** Utils
// import { hexToRGBA } from 'src//utils/hex-to-rgba'

// ** Menu Components
import HorizontalNavItems from './HorizontalNavItems'

// ** Types
interface Props {
  horizontalNavItems?: HorizontalNavItemsType
}

const Navigation = (props: Props) => {
  return (
    <Box
      className='menu-content'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
          '&:not(:last-child)': { mr: 2 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 220 })
        }
      }}
    >
      <HorizontalNavItems {...props} />
    </Box>
  )
}

export default Navigation
