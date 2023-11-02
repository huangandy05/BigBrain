import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';

const GenericBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Georgia, serif',
  marginBottom: '10px'
});

export default GenericBox;
