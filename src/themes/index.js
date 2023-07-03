import { createTheme } from '@mui/material/styles';
import colors from "./colors"

// A custom theme for this app
const theme = createTheme({
  palette: {
  	mode: 'dark',
    primary: {
      main: colors.primary,
    }
  },
});

export default theme;