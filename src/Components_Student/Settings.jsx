import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { Person, EmojiEvents, Quiz, ContactMail, Description, ExitToApp, ArrowBack, Info, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const Settings = () => {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); navigate('/'); };

  const menuItems = [
    { icon: Person, label: 'Profile', path: '/profile', color: '#667eea' },
    { icon: EmojiEvents, label: 'My Results', path: '/results', color: '#FF9800' },
    { icon: Quiz, label: 'Quizzes Available', path: '/quizzes', color: '#4CAF50' },
    { icon: Info, label: 'About Us', path: '/about', color: '#2196F3' },
    { icon: ContactMail, label: 'Contact', path: '/contact', color: '#9C27B0' },
    { icon: Description, label: 'Terms & Conditions', path: '/terms', color: '#00BCD4' },
    { icon: Description, label: 'Privacy Policy', path: '/privacy', color: '#FF5722' },
    { icon: ExitToApp, label: 'Sign Out', action: handleLogout, color: '#f44336' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 500, height: 500, background: '#667eea', top: '-15%', left: '-10%' }} />
      <Orb style={{ width: 400, height: 400, background: '#764ba2', top: '40%', right: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#f093fb', bottom: '-10%', left: '35%' }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Box onClick={() => navigate('/dashboard')} sx={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { background: 'rgba(255,255,255,0.18)' } }}>
                <ArrowBack sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </motion.div>
            <Typography sx={{ fontWeight: 800, fontSize: 28, color: 'white' }}>⚙️ Settings</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...glass, overflow: 'hidden' }}>
            {menuItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }} whileHover={{ x: 6 }} whileTap={{ scale: 0.98 }}>
                <Box
                  onClick={() => item.action ? item.action() : navigate(item.path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2.2, cursor: 'pointer',
                    borderBottom: i < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': { background: `${item.color}12` }
                  }}
                >
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, background: `${item.color}20`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon sx={{ color: item.color, fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 15, flex: 1 }}>{item.label}</Typography>
                  <ChevronRight sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Settings;
