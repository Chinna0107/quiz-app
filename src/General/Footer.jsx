import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2">
            © 2026 CODEATHON 2K26 Quiz App. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link onClick={() => navigate('/privacy')} color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
              Privacy Policy
            </Link>
            <Link onClick={() => navigate('/terms')} color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
              Terms of Service
            </Link>
            <Link onClick={() => navigate('/contact')} color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;