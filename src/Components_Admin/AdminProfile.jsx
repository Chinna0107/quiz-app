import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, TextField, Button, AppBar, Toolbar, Avatar, Grid, Chip } from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, Edit, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const AdminProfile = ({ user }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    created_at: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/admin/profile');
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/api/admin/profile', {
        name: profileData.name
      });
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        timer: 2000,
        showConfirmButton: false
      });
      setEditing(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }} elevation={0}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'white', mr: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Admin Profile</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <AdminPanelSettings />
            </Avatar>
            <Typography sx={{ color: 'white' }}>{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#ff6b6b' }}>
                      <AdminPanelSettings sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                      Administrator Profile
                    </Typography>
                    <Chip label="Admin" sx={{ bgcolor: '#ff6b6b', color: 'white', fontWeight: 'bold' }} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      name="name"
                      label="Full Name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    
                    <TextField
                      name="email"
                      label="Email"
                      value={profileData.email}
                      disabled
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    
                    <TextField
                      label="Admin Since"
                      value={profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-GB') : ''}
                      disabled
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                      {editing ? (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={loading}
                            sx={{
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                              '&:hover': { background: 'linear-gradient(45deg, #ff5252, #d84315)' }
                            }}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setEditing(false)}
                            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => setEditing(true)}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                            '&:hover': { background: 'linear-gradient(45deg, #ff5252, #d84315)' }
                          }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminProfile;