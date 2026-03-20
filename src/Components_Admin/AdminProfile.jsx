import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, TextField, InputAdornment, Chip } from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, Edit, Save, Cancel, Email, CalendarToday, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.1)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' }, '&.Mui-disabled': { background: 'rgba(255,255,255,0.05)' } },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputBase-input.Mui-disabled': { color: 'rgba(255,255,255,0.4)', WebkitTextFillColor: 'rgba(255,255,255,0.4)' },
};

const AdminProfile = ({ user }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: '', email: '', created_at: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); navigate('/'); };

  useEffect(() => {
    api.get('/api/admin/profile').then(res => setProfileData(res.data)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/admin/profile', { name: profileData.name });
      Swal.fire({ icon: 'success', title: 'Profile Updated!', timer: 2000, showConfirmButton: false });
      setEditing(false);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update profile' });
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 400, height: 400, background: '#ff6b6b', top: '-10%', left: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#764ba2', top: '30%', right: '-8%' }} />
      <Orb style={{ width: 300, height: 300, background: '#ee5a24', bottom: '-5%', left: '30%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Back</Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>Admin Profile</Typography>
        <Button onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Logout</Button>
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Avatar */}
          <Box sx={{ ...glass, p: 4, textAlign: 'center', mb: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #ff6b6b, #ee5a24)' }} />
            <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(255,107,107,0.4)' }}>
              <AdminPanelSettings sx={{ fontSize: 46, color: 'white' }} />
            </Avatar>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 22 }}>{profileData.name || 'Administrator'}</Typography>
            <Chip label="Admin" size="small" sx={{ mt: 1, background: 'rgba(255,107,107,0.3)', color: '#ff8a80', border: '1px solid rgba(255,107,107,0.4)', fontWeight: 700 }} />
          </Box>

          {/* Form */}
          <Box sx={{ ...glass, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #ff6b6b, #ee5a24)' }} />
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Account Details</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField name="name" label="Full Name" value={profileData.name} onChange={(e) => setProfileData(d => ({ ...d, name: e.target.value }))} disabled={!editing} fullWidth sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }} />
              <TextField label="Email" value={profileData.email} disabled fullWidth sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }} />
              <TextField label="Admin Since" value={profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-GB') : ''} disabled fullWidth sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                {editing ? (
                  <>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading}
                        sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', boxShadow: '0 4px 20px rgba(255,107,107,0.4)', '&:hover': { background: 'linear-gradient(135deg, #ff5252, #d84315)' } }}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </motion.div>
                    <Button startIcon={<Cancel />} onClick={() => setEditing(false)} sx={{ px: 3, py: 1.5, borderRadius: 2, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.08)', color: 'white' } }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="contained" startIcon={<Edit />} onClick={() => setEditing(true)}
                      sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', boxShadow: '0 4px 20px rgba(255,107,107,0.4)', '&:hover': { background: 'linear-gradient(135deg, #ff5252, #d84315)' } }}>
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminProfile;
