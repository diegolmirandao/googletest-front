// ** React Imports
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import Translate from 'mdi-material-ui/Translate'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Type Import
import { Settings } from '../../../context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<any>(null)

  // ** Hook
  const { i18n, t } = useTranslation()

  // ** Vars
  const { direction } = settings

  useEffect(() => {
    if (i18n.language === 'ar' && direction === 'ltr') {
      saveSettings({ ...settings, direction: 'ltr' })
    } else if (i18n.language === 'ar' || direction === 'rtl') {
      saveSettings({ ...settings, direction: 'rtl' })
    } else {
      saveSettings({ ...settings, direction: 'ltr' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, direction])

  const handleLangDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLangDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleLangItemClick = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang)
    handleLangDropdownClose()
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' aria-controls='customized-menu' onClick={handleLangDropdownOpen}>
        <Translate />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLangDropdownClose}
        sx={{ '& .MuiMenu-paper': { mt: 4, minWidth: 130 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          key={'es'}
          sx={{ py: 2 }}
          selected={i18n.language === 'es'}
          onClick={() => {
            handleLangItemClick('es')
            saveSettings({ ...settings, direction: 'ltr' })
          }}
        >
          {t('spanish')}
        </MenuItem>
        <MenuItem
          key={'en'}
          sx={{ py: 2 }}
          selected={i18n.language === 'en'}
          onClick={() => {
            handleLangItemClick('en')
            saveSettings({ ...settings, direction: 'ltr' })
          }}
        >
          {t('english')}
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default LanguageDropdown
