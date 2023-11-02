import { styled } from '@mui/material/styles';

const QuizCard = styled('div')(() => ({
  padding: '10px 40px',
  textAlign: 'center',
  color: 'black',
  '@media(max-width: 650px)': {
    width: '300px',
  },
  '@media(min-width: 650px) and (max-width: 900px)': {
    width: '500px',
  },
  width: '800px',
  marginTop: '20px',
  // from https://ishadeed.com/article/new-facebook-css/
  boxShadow:
    '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
  borderRadius: '35px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
}));

export default QuizCard;
