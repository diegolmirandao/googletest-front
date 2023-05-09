// ** Type Imports
import { OwnerStateThemeType } from './'
import { Skin } from 'src/types/Layout'

const Autocomplete = (skin: Skin) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }: OwnerStateThemeType) => ({
          boxShadow: theme.shadows[6],
          ...(skin === 'bordered' && { boxShadow: 'none', border: `1px solid ${theme.palette.divider}` })
        })
      }
    }
  }
}

export default Autocomplete
