// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icons Imports
import ExportVariantIcon from 'mdi-material-ui/ExportVariant'
import ViewColumnIcon from 'mdi-material-ui/ViewColumn'
import PlusIcon from 'mdi-material-ui/Plus'
import { useTranslation } from 'react-i18next'

interface TableHeaderProps {
  onAddClick: () => void
  onExportClick: () => void
  onColumnsClick: () => void
  canAdd: boolean
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { onAddClick, onExportClick, onColumnsClick, canAdd } = props
  const { t } = useTranslation()

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {canAdd &&
          <Box>
            <Button sx={{ display: {xs: 'none', md: 'inline-flex'}, mr: 2, mb: 2 }} onClick={onAddClick} variant='contained' startIcon={<PlusIcon fontSize='small' />}>
              {t('add')}
            </Button>
            <Button sx={{ display: {xs: 'inline-flex', md: 'none'}, mr: 2, mb: 2 }} onClick={onAddClick} variant='contained'><PlusIcon fontSize='small'/></Button>
          </Box>
        }
      </Box>
      <Box sx={{ display: {xs: 'none', md: 'inline-flex'}}}>
        <Button sx={{ mr: 4, mb: 2 }} color='error' variant='outlined' onClick={onExportClick} startIcon={<ExportVariantIcon fontSize='small' />}>
          {t('export')}
        </Button>
        <Button sx={{ mr: 4, mb: 2 }} color='secondary' variant='outlined' onClick={onColumnsClick} startIcon={<ViewColumnIcon fontSize='small' />}>
          {t('columns')}
        </Button>
      </Box>
      <Box sx={{ display: {xs: 'inline-flex', md: 'none'}}}>
        <Button sx={{ mr: 2, mb: 2 }} color='error' variant='outlined' onClick={onExportClick}><ExportVariantIcon fontSize='small'/></Button>
        <Button sx={{ mr: 2, mb: 2 }} color='secondary' variant='outlined' onClick={onColumnsClick}><ViewColumnIcon fontSize='small'/></Button>
      </Box>
    </Box>
  )
}

export default TableHeader
