import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const GenericTextfield = styled(TextField)({
  margin: '10px 0',
  width: '400px',
  '@media(max-width: 700px)': {
    width: '300px',
  },
});

export default GenericTextfield;
