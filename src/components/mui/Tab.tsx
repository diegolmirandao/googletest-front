import { styled } from "@mui/material";
import MuiTab, { TabProps } from '@mui/material/Tab';

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    '& svg': {
      marginBottom: '0 !important',
      marginRight: theme.spacing(1)
    }
  }));

export default Tab;