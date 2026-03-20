import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Grid } from '@mui/material';
import { ArrowBack, Person, ExitToApp, Email, CalendarToday, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const { data: profileData, loading } = useCache('user-profile', async () => (await api.get('/api/users/profile')).data);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); navigate('/'); };

  const fields = [
    { icon: Person, color: '#667eea', label: 'Full Name', value: profileData?.name },
    { icon: Email, color: '#764ba2', label: 'Email Address', value: profileData?.email },
    { icon: Phone, color: '#FF9800', label: 'Phone Number', value: profileData?.phone_number || 'Not provided' },
    { icon: CalendarToday, color: '#4CAF50', label: 'Member Since', value: profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString('en-GB') : null },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 500, height: 500, background: '#667eea', top: '-15%', left: '-10%' }} />
      <Orb style={{ width: 400, height: 400, background: '#764ba2', top: '40%', right: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#f093fb', bottom: '-10%', left: '35%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Back</Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>My Profile</Typography>
        <Button onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Logout</Button>
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Avatar section */}
          <Box sx={{ ...glass, p: 4, textAlign: 'center', mb: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' }} />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
              <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(102,126,234,0.4)' }}>
                <Person sx={{ fontSize: 52, color: 'white' }} />
              </Avatar>
            </motion.div>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 24 }}>{loading ? '...' : profileData?.name || 'User'}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, mt: 0.5 }}>Student</Typography>
          </Box>

          {/* Info fields */}
          <Box sx={{ ...glass, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #667eea, #764ba2)' }} />
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Account Details</Typography>
            </Box>
            <Grid container spacing={2}>
              {fields.map((f, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <Box sx={{ p: 2, borderRadius: 2, background: `${f.color}10`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <f.icon sx={{ color: f.color, fontSize: 18 }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, mb: 0.3 }}>{f.label}</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13, wordBreak: 'break-all' }}>{loading ? '...' : f.value || 'Not available'}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile;
