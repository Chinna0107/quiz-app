import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, TextField, Button, AppBar, Toolbar, Avatar, Grid } from '@mui/material';
import { ArrowBack, Person, ExitToApp, Email, CalendarToday, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  
  const { data: profileData, loading } = useCache(
    'user-profile',
    async () => {
      const response = await api.get('/api/users/profile');
      return response.data;
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-30, -120, -30],
              x: [-30, 30, -30],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 80 + i * 30,
              height: 80 + i * 30,
              background: `rgba(255,255,255,${0.03 + i * 0.02})`,
              borderRadius: '50%',
              filter: 'blur(2px)'
            }}
          />
        ))}
      </Box>

      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', zIndex: 10 }} elevation={0}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ color: 'white', mr: 2 }}>
            Back to Dashboard
          </Button>
          {/* <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>My Profile</Typography> */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <Person />
            </Avatar>
            <Typography sx={{ color: 'white' }}>{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 1, sm: 2, md: 0 }, position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 100 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          style={{ width: '100%', maxWidth: '800px', margin: '0 10px' }}
        >
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: 4,
            boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)', 
              p: { xs: 3, sm: 4, md: 6 }, 
              textAlign: 'center',
              position: 'relative'
            }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              >
                <Avatar sx={{ 
                  width: { xs: 80, sm: 100, md: 120 }, 
                  height: { xs: 80, sm: 100, md: 120 }, 
                  mx: 'auto', 
                  mb: { xs: 2, md: 3 }, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                  <Person sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}>
                  {profileData?.name || 'User Profile'}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Student Dashboard
                </Typography>
              </motion.div>
            </Box>
            
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: { xs: 2, sm: 3 }, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea15, #764ba205)',
                      border: '2px solid #667eea20',
                      mb: { xs: 2, md: 3 }
                    }}>
                      <Person sx={{ fontSize: { xs: 30, sm: 40 }, color: '#667eea', mr: { xs: 1.5, sm: 2 } }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Full Name</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {loading ? 'Loading...' : profileData?.name || 'Not available'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: { xs: 2, sm: 3 }, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #764ba215, #667eea05)',
                      border: '2px solid #764ba220',
                      mb: { xs: 2, md: 3 }
                    }}>
                      <Email sx={{ fontSize: { xs: 30, sm: 40 }, color: '#764ba2', mr: { xs: 1.5, sm: 2 } }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Email Address</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '0.9rem', sm: '1.25rem' }, wordBreak: 'break-all' }}>
                          {loading ? 'Loading...' : profileData?.email || 'Not available'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: { xs: 2, sm: 3 }, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #FF980015, #FF570005)',
                      border: '2px solid #FF980020',
                      mb: { xs: 2, md: 3 }
                    }}>
                      <Phone sx={{ fontSize: { xs: 30, sm: 40 }, color: '#FF9800', mr: { xs: 1.5, sm: 2 } }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Phone Number</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {loading ? 'Loading...' : profileData?.phone_number || 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: { xs: 2, sm: 3 }, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #28a74515, #20c99705)',
                      border: '2px solid #28a74520',
                      textAlign: 'center',
                      justifyContent: 'center'
                    }}>
                      <CalendarToday sx={{ fontSize: { xs: 30, sm: 40 }, color: '#28a745', mr: { xs: 1.5, sm: 2 } }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Member Since</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {loading ? 'Loading...' : (profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString('en-GB') : 'Not available')}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Profile;