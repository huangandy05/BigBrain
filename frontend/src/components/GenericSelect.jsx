import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const GenericSelect = styled(Select)({
  width: '400px',
  '@media(max-width: 700px)': {
    width: '300px',
  },
  margin: '10px 0',
});

export default GenericSelect;
