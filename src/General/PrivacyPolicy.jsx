import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '80vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
                Privacy Policy
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Information We Collect</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                We collect information you provide directly to us, such as when you create an account, take a quiz, or contact us for support.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>How We Use Your Information</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Information Sharing</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </Typography>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Data Security</Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
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

export default PrivacyPolicy;