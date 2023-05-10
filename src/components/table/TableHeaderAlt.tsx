// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icons Imports
import MagnifyIcon from 'mdi-material-ui/Magnify'
import PlusIcon from 'mdi-material-ui/Plus'
import { InputAdornment, TextField } from '@mui/material'
import { t } from 'i18next'

interface TableHeaderProps {
  onAddClick: () => void;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  canAdd: boolean;
}

const TableHeaderAlt = (props: TableHeaderProps) => {
  // ** Props
  const { onAddClick, onFilterChange, canAdd } = props;

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
      <Box>
        <TextField
            onChange={onFilterChange}
            size="small"
            placeholder={String(t('search'))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyIcon />
                </InputAdornment>
              ),
            }}
        />
      </Box>
    </Box>
  );
};

export default TableHeaderAlt;
