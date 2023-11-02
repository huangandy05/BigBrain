import GenericBox from './GenericBox';
import { styled } from '@mui/material/styles';

const InnerBox = styled(GenericBox)({
  backgroundColor: 'white',
  borderRadius: '25px',
  width: '600px',
  '@media(max-width: 700px)': {
    width: '350px',
  },
  // from https://ishadeed.com/article/new-facebook-css/
  boxShadow:
    '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
  paddingBottom: '25px',
  marginTop: '50px',
  wordBreak: 'break-all',
  padding: '0 10px 25px 10px'
});

export default InnerBox;
