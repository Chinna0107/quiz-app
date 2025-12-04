import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '80vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
                Terms of Service
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>1. Acceptance of Terms</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                By accessing and using this quiz application, you accept and agree to be bound by the terms and provision of this agreement.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>2. Use License</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>3. User Accounts</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>4. Prohibited Uses</Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                You may not use our service for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction.
              </Typography>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TermsOfService;