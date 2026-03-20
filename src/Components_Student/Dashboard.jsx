import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Grid, Chip } from '@mui/material';
import { Quiz, Person, ExitToApp, TrendingUp, EmojiEvents, School, PlayArrow, CheckCircle, Star, Settings } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Orb = ({ style }) => (
  <motion.div
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }}
  />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const { data: dashboardData, loading } = useCache('dashboard-data', async () => {
    const [quizzesRes, statsRes] = await Promise.all([api.get('/api/users/quizzes'), api.get('/api/users/user-stats')]);
    const uniqueQuizzes = quizzesRes.data.filter((q, i, a) => i === a.findIndex(x => x.title === q.title));
    return { quizzes: uniqueQuizzes, stats: { totalQuizzes: uniqueQuizzes.length, completedQuizzes: statsRes.data.quizzesAttempted, averageScore: statsRes.data.averageScore } };
  });

  const stats = dashboardData?.stats || { totalQuizzes: 0, completedQuizzes: 0, averageScore: 0 };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 500, height: 500, background: '#667eea', top: '-15%', left: '-10%' }} />
      <Orb style={{ width: 400, height: 400, background: '#764ba2', top: '40%', right: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#f093fb', bottom: '-10%', left: '35%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1 }}>✨ Quiz Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <Person sx={{ color: 'white' }} />
            </Avatar>
          </motion.div>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', display: { xs: 'none', sm: 'block' } }}>{user?.name}</Typography>
          <Button onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>
            Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.3)', fontSize: { xs: '1.8rem', md: '3rem' }, mb: 1 }}>
              Welcome back, {user?.name}! 🎓
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>Ready to challenge yourself? Let's continue your learning journey!</Typography>
          </Box>
        </motion.div>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }} justifyContent="center">
          {[
            { label: 'Total Quizzes', value: stats.totalQuizzes, icon: School, color: '#667eea' },
            { label: 'Completed', value: stats.completedQuizzes, icon: CheckCircle, color: '#4CAF50' },
            { label: 'Average Score', value: `${stats.averageScore}%`, icon: TrendingUp, color: '#FF9800' },
          ].map((item, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }}>
                <Box sx={{ ...glass, p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: `${item.color}25`, border: `2px solid ${item.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <item.icon sx={{ color: item.color, fontSize: 28 }} />
                  </Box>
                  <Typography sx={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1 }}>{loading ? '...' : item.value}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, fontSize: 14 }}>{item.label}</Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Nav Cards */}
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: 'Take Quizzes', desc: 'Browse and take available quizzes', icon: Quiz, color: '#667eea', path: '/quizzes' },
            { title: 'My Results', desc: 'View results and track progress', icon: EmojiEvents, color: '#FF9800', path: '/results' },
            { title: 'Profile', desc: 'Manage your account information', icon: Person, color: '#4CAF50', path: '/profile' },
            { title: 'Settings', desc: 'Customize your preferences', icon: Settings, color: '#9C27B0', path: '/settings' },
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ y: -10, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Box onClick={() => navigate(card.path)} sx={{ ...glass, p: 3, cursor: 'pointer', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.3s', '&:hover': { background: 'rgba(255,255,255,0.14)', border: `1px solid ${card.color}50` } }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: `${card.color}20`, border: `2px solid ${card.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <card.icon sx={{ color: card.color, fontSize: 32 }} />
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 17 }}>{card.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.5 }}>{card.desc}</Typography>
                  <Button startIcon={<PlayArrow />} sx={{ mt: 'auto', color: card.color, border: `1px solid ${card.color}40`, borderRadius: 2, px: 2, '&:hover': { background: `${card.color}15` } }}>
                    Go
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
