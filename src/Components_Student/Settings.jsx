import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 70%, #f093fb 100%)',
        color: 'white',
        textAlign: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 12 }}
      >
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, mb: 2 }}>
          ⚙️ Settings
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          This page is coming soon…
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Typography variant="body1" sx={{ opacity: 0.8, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          😄 Stay tuned for new updates and settings options!
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Settings;
