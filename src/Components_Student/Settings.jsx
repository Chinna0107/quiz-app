import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Person, EmojiEvents, Quiz, ContactMail, Description, ExitToApp, ArrowBack, Info } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const menuItems = [
    { icon: Person, label: 'Profile', path: '/profile', color: '#667eea' },
    { icon: EmojiEvents, label: 'My Results', path: '/results', color: '#FF9800' },
    { icon: Quiz, label: 'Quizzes Available', path: '/quizzes', color: '#4CAF50' },
    { icon: Info, label: 'About Us', path: '/about', color: '#2196F3' },
    { icon: ContactMail, label: 'Contact', path: '/contact', color: '#9C27B0' },
    { icon: Description, label: 'Terms & Conditions', path: '/terms', color: '#00BCD4' },
    { icon: Description, label: 'Privacy Policy', path: '/privacy', color: '#FF5722' },
    { icon: ExitToApp, label: 'Sign Out', action: handleLogout, color: '#F44336' }
  ];

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
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ArrowBack 
                onClick={() => navigate('/dashboard')} 
                sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  cursor: 'pointer',
                  mr: 2,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  p: 1
                }} 
              />
            </motion.div>
            <Typography variant="h3" sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              ⚙️ Settings
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card sx={{ 
            background: 'rgba(255,255,255,0.98)', 
            backdropFilter: 'blur(30px)',
            borderRadius: 5,
            boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 0 }}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ListItem
                        onClick={() => item.action ? item.action() : navigate(item.path)}
                        sx={{
                          cursor: 'pointer',
                          py: 3,
                          px: 4,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `linear-gradient(90deg, ${item.color}15, transparent)`
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Box sx={{
                            background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                            borderRadius: '50%',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 20px ${item.color}40`
                          }}>
                            <item.icon sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            color: '#333'
                          }}
                        />
                      </ListItem>
                    </motion.div>
                    {index < menuItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Settings;
