import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Chip, CircularProgress } from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, Block, CheckCircle, People } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const ManageUsers = ({ user }) => {
  const navigate = useNavigate();
  const { data: users, loading, refetch } = useCache('admin-users', async () => (await api.get('/api/admin/users')).data);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); navigate('/'); };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.put(`/api/admin/users/${userId}/block`, { blocked: !isBlocked });
      Swal.fire({ icon: 'success', title: isBlocked ? 'User Unblocked!' : 'User Blocked!', timer: 2000, showConfirmButton: false });
      refetch();
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update user status' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 400, height: 400, background: '#ff6b6b', top: '-10%', left: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#764ba2', top: '30%', right: '-8%' }} />
      <Orb style={{ width: 300, height: 300, background: '#ee5a24', bottom: '-5%', left: '30%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Back</Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>👥 Manage Users</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', width: 36, height: 36 }}><AdminPanelSettings sx={{ color: 'white', fontSize: 18 }} /></Avatar>
          <Button onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Logout</Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>User Management</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Control and monitor user access</Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...glass, overflow: 'hidden' }}>
            {/* Table header */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 2, px: 3, py: 2, background: 'rgba(255,107,107,0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['Name', 'Email', 'Status', 'Joined', 'Action'].map((h, i) => (
                <Typography key={i} sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, textAlign: i > 1 ? 'center' : 'left' }}>{h}</Typography>
              ))}
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress sx={{ color: '#ff6b6b' }} /></Box>
            ) : !(users || []).length ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <People sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No users found</Typography>
              </Box>
            ) : (
              (users || []).map((u, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 2, px: 3, py: 2, alignItems: 'center', borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', '&:hover': { background: 'rgba(255,255,255,0.05)' }, transition: 'all 0.2s' }}>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{u.name}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip icon={u.is_blocked ? <Block sx={{ fontSize: '14px !important' }} /> : <CheckCircle sx={{ fontSize: '14px !important' }} />} label={u.is_blocked ? 'Blocked' : 'Active'} size="small"
                        sx={{ background: u.is_blocked ? 'rgba(244,67,54,0.2)' : 'rgba(76,175,80,0.2)', color: u.is_blocked ? '#f44336' : '#4CAF50', border: `1px solid ${u.is_blocked ? 'rgba(244,67,54,0.4)' : 'rgba(76,175,80,0.4)'}`, fontWeight: 600, fontSize: 11 }} />
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center' }}>{new Date(u.created_at).toLocaleDateString('en-GB')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button size="small" onClick={() => handleBlockUser(u.id, u.is_blocked)}
                        sx={{ borderRadius: 2, px: 2, fontSize: 12, fontWeight: 600, background: u.is_blocked ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: u.is_blocked ? '#4CAF50' : '#f44336', border: `1px solid ${u.is_blocked ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)'}`, '&:hover': { background: u.is_blocked ? 'rgba(76,175,80,0.35)' : 'rgba(244,67,54,0.35)' } }}>
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              ))
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ManageUsers;
