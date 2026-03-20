import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Grid, Chip, Divider, LinearProgress } from '@mui/material';
import { People, Quiz, Add, ExitToApp, AdminPanelSettings, TrendingUp, Analytics, BarChart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

/* ─── Shared styles ─────────────────────────────────────────── */
const BG = 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 45%, #6b1a1a 100%)';

const glass = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 3,
};

/* ─── Animated background orb ───────────────────────────────── */
const Orb = ({ style }) => (
  <motion.div
    animate={{ y: [-25, 25, -25], x: [-15, 15, -15] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(70px)', opacity: 0.3, pointerEvents: 'none', ...style }}
  />
);

/* ─── Section header ─────────────────────────────────────────── */
const SectionHeader = ({ label, accentColor = '#ff6b6b' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
    <Box sx={{ width: 4, height: 22, borderRadius: 2, background: accentColor }} />
    <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 17, letterSpacing: 0.3 }}>{label}</Typography>
  </Box>
);

/* ─── Stat card ──────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color, clickable, onClick, loading, delay }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -6 }}>
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        ...glass, p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.25s',
        '&:hover': clickable ? { background: 'rgba(255,255,255,0.12)', border: `1px solid ${color}55` } : {},
      }}
    >
      {/* top accent */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />

      <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: `${color}18`, border: `2px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
        <Icon sx={{ color, fontSize: 28 }} />
      </Box>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.3, type: 'spring', stiffness: 180 }}>
        <Typography sx={{ fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1 }}>
          {loading ? <Box component="span" sx={{ opacity: 0.4 }}>—</Box> : value}
        </Typography>
      </motion.div>

      <Typography sx={{ color: 'rgba(255,255,255,0.45)', mt: 0.8, fontSize: 13, fontWeight: 500 }}>{label}</Typography>

      {loading && (
        <LinearProgress sx={{ mt: 1.5, height: 2, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: color } }} />
      )}
    </Box>
  </motion.div>
);

/* ─── Action row ─────────────────────────────────────────────── */
const ActionRow = ({ label, desc, icon: Icon, gradient, color, onClick, delay }) => (
  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2,
        cursor: 'pointer', background: `${color}12`, border: `1px solid ${color}28`,
        transition: 'all 0.2s',
        '&:hover': { background: `${color}22`, border: `1px solid ${color}55` },
      }}
    >
      <Box sx={{ width: 42, height: 42, borderRadius: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 14px ${color}45` }}>
        <Icon sx={{ color: 'white', fontSize: 20 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{label}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, mt: 0.2 }}>{desc}</Typography>
      </Box>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.7 }} />
    </Box>
  </motion.div>
);

/* ─── Activity row ───────────────────────────────────────────── */
const ActivityRow = ({ text, time, color, icon: Icon, delay }) => (
  <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} whileHover={{ x: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.8, borderRadius: 2, background: `${color}0d`, border: `1px solid ${color}1a`, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: color }} />
      <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon sx={{ color, fontSize: 17 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{text}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.2 }}>System notification</Typography>
      </Box>
      <Chip label={time} size="small" sx={{ background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 600, fontSize: 10, height: 20 }} />
    </Box>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════ */
const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const { data: stats, loading } = useCache('admin-stats', async () => {
    const res = await api.get('/api/users/stats');
    return res.data;
  });

  const statsData = stats || { totalUsers: 0, totalQuizzes: 0, totalSubmissions: 0 };

  return (
    <Box sx={{ minHeight: '100vh', background: BG, position: 'relative', overflow: 'hidden' }}>

      {/* ── Background orbs ── */}
      <Orb style={{ width: 480, height: 480, background: '#ff6b6b', top: '-14%', left: '-12%' }} />
      <Orb style={{ width: 380, height: 380, background: '#764ba2', top: '38%', right: '-9%' }} />
      <Orb style={{ width: 300, height: 300, background: '#ee5a24', bottom: '-8%', left: '34%' }} />

      {/* ── Navbar ── */}
      <Box sx={{
        ...glass, borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        px: { xs: 2, md: 5 }, py: 1.5,
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {/* Brand */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar
            onClick={() => navigate('/admin/profile')}
            sx={{ bgcolor: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer', width: 40, height: 40 }}
          >
            <AdminPanelSettings sx={{ color: 'white', fontSize: 20 }} />
          </Avatar>
        </motion.div>

        <Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>Admin Dashboard</Typography>
          <Chip label="Administrator" size="small" sx={{ height: 16, fontSize: 9, mt: 0.3, background: 'rgba(255,107,107,0.25)', color: '#ff8a80', border: '1px solid rgba(255,107,107,0.35)' }} />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, display: { xs: 'none', md: 'block' } }}>
          Welcome back, <strong style={{ color: 'white' }}>{user?.name}</strong>
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1 }} />

        <Button
          onClick={handleLogout}
          startIcon={<ExitToApp sx={{ fontSize: 16 }} />}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 2, px: 2, fontSize: 13, '&:hover': { background: 'rgba(255,255,255,0.09)', color: 'white' } }}
        >
          Logout
        </Button>
      </Box>

      {/* ── Page body ── */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>

        {/* ── Page title ── */}
        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.7rem', md: '2.6rem' }, letterSpacing: '-0.5px', mb: 0.5 }}>
              Dashboard Overview
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>
              Monitor your platform stats and manage everything from here.
            </Typography>
          </Box>
        </motion.div>

        {/* ── Stats row ── */}
        <Box sx={{ mb: 1 }}>
          <SectionHeader label="Platform Statistics" accentColor="#ff6b6b" />
        </Box>
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          {[
            { label: 'Total Users', value: statsData.totalUsers, icon: People, color: '#ff6b6b', delay: 0.05 },
            { label: 'Active Quizzes', value: statsData.totalQuizzes, icon: Quiz, color: '#667eea', clickable: true, onClick: () => navigate('/admin/quiz-preview'), delay: 0.12 },
            { label: 'Total Submissions', value: statsData.totalSubmissions, icon: TrendingUp, color: '#28a745', delay: 0.19 },
          ].map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <StatCard {...s} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {/* ── Quick Actions + Recent Activity ── */}
        <Grid container spacing={3} alignItems="stretch">

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }} style={{ height: '100%' }}>
              <Box sx={{ ...glass, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <SectionHeader label="Quick Actions" accentColor="#ff6b6b" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  {[
                    { label: 'Create New Quiz', desc: 'Build and publish a new quiz', icon: Add, gradient: 'linear-gradient(135deg,#ff6b6b,#ee5a24)', color: '#ff6b6b', onClick: () => navigate('/admin/create-quiz'), delay: 0.35 },
                    { label: 'View Quiz Results', desc: 'Analyze student performance', icon: Analytics, gradient: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#667eea', onClick: () => navigate('/admin/results'), delay: 0.42 },
                    { label: 'Manage Users', desc: 'Control user access & status', icon: People, gradient: 'linear-gradient(135deg,#28a745,#20c997)', color: '#28a745', onClick: () => navigate('/admin/users'), delay: 0.49 },
                    { label: 'Quiz Preview', desc: 'Preview all available quizzes', icon: BarChart, gradient: 'linear-gradient(135deg,#FF9800,#F57C00)', color: '#FF9800', onClick: () => navigate('/admin/quiz-preview'), delay: 0.56 },
                  ].map((a, i) => <ActionRow key={i} {...a} />)}
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }} style={{ height: '100%' }}>
              <Box sx={{ ...glass, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <SectionHeader label="Recent Activity" accentColor="#28a745" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  {[
                    { text: 'New user registered', time: '2 min ago', color: '#ff6b6b', icon: People, delay: 0.38 },
                    { text: 'Quiz completed by student', time: '5 min ago', color: '#667eea', icon: Quiz, delay: 0.44 },
                    { text: 'New quiz created', time: '1 hr ago', color: '#28a745', icon: Add, delay: 0.50 },
                    { text: 'Results exported', time: '3 hrs ago', color: '#FF9800', icon: Analytics, delay: 0.56 },
                  ].map((a, i) => <ActivityRow key={i} {...a} />)}
                </Box>

                {/* mini divider + footer note */}
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', my: 2 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center' }}>
                  Showing last 4 system events
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* ── Footer banner ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <Box sx={{ ...glass, mt: 4, px: 4, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Quiz Management System</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, mt: 0.3 }}>Empowering education through interactive assessments</Typography>
            </Box>
            <Chip label="v1.0 · Live" size="small" sx={{ background: 'rgba(40,167,69,0.2)', color: '#4caf50', border: '1px solid rgba(40,167,69,0.35)', fontWeight: 700, fontSize: 11 }} />
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
};

export default AdminDashboard;
