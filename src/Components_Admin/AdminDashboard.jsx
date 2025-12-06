import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar, Avatar, Chip, IconButton, LinearProgress, Divider } from '@mui/material';
import { Dashboard, People, Quiz, Add, ExitToApp, AdminPanelSettings, TrendingUp, Analytics, Star, Notifications, Settings } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';
// import QuizResultsTable from './AdminResults';  // ⬅ NEW IMPORT

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const { data: stats, loading } = useCache(
    'admin-stats',
    async () => {
      const response = await api.get('/api/users/stats');
      return response.data;
    }
  );

  const statsData = stats || { totalUsers: 0, totalQuizzes: 0, totalSubmissions: 0 };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ff6b6b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100, -20],
              x: [-20, 20, -20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 60 + i * 20,
              height: 60 + i * 20,
              background: `rgba(255,255,255,${0.05 + i * 0.02})`,
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </Box>
      
      <AppBar position="static" sx={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 10 }} elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 45, height: 45, cursor: 'pointer' }}
              onClick={() => navigate('/admin/profile')}
            >
              <AdminPanelSettings sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.3rem' }}>Admin Dashboard</Typography>
              <Chip label="Administrator" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }} />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <Notifications />
            </IconButton>
            <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <Settings />
            </IconButton>
            <Typography sx={{ color: 'white', fontWeight: 500 }}>Welcome, {user?.name}</Typography>
            <IconButton onClick={handleLogout} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h3" sx={{ color: 'white', mb: 1, textAlign: 'center', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}>
            Dashboard Overview
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, textAlign: 'center' }}>
            Manage your quiz platform with ease
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ mb: { xs: 3, md: 5 }, maxWidth: '1100px', mx: 'auto' }}>
          {[
            { label: "Total Users", value: statsData.totalUsers, icon: People, color: "#ff6b6b", gradient: "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)", trend: "+12%" },
            { label: "Total Quizzes", value: statsData.totalQuizzes, icon: Quiz, color: "#667eea", gradient: "linear-gradient(135deg, #667eea 0%, #8a9bff 100%)", trend: "+8%" },
            { label: "Total Submissions", value: statsData.totalSubmissions, icon: TrendingUp, color: "#28a745", gradient: "linear-gradient(135deg, #28a745 0%, #4caf50 100%)", trend: "+23%" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.95)', 
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: item.gradient }} />
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 5 }, px: { xs: 3, md: 5 } }}>
                    <Box sx={{ 
                      background: item.gradient, 
                      borderRadius: '50%', 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: `0 10px 30px ${item.color}40`
                    }}>
                      <item.icon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.3 + 0.5, type: "spring", stiffness: 200 }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>{loading ? '...' : item.value}</Typography>
                    </motion.div>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>{item.label}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75 + index * 5} 
                      sx={{ 
                        mb: 2, 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: item.gradient,
                          borderRadius: 3
                        }
                      }} 
                    />
                    <Chip 
                      icon={<Star sx={{ fontSize: 16 }} />}
                      label={item.trend} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e8f5e8', 
                        color: '#28a745',
                        fontWeight: 'bold',
                        '& .MuiChip-label': { px: 1 }
                      }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Divider sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.3)', height: 2 }} />
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Dashboard sx={{ color: '#ff6b6b' }} />
                    Quick Actions
                  </Typography>

                  <AnimatePresence>
                    {[
                      { label: 'Create New Quiz', icon: Add, action: () => navigate('/admin/create-quiz'), gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', desc: 'Build engaging quizzes' },
                      { label: 'View Quiz Results', icon: Analytics, action: () => navigate('/admin/results'), gradient: 'linear-gradient(135deg, #667eea, #764ba2)', desc: 'Analyze performance data' },
                      { label: 'Manage Users', icon: People, action: () => navigate('/admin/users'), gradient: 'linear-gradient(135deg, #28a745, #20c997)', desc: 'Control user access' }
                    ].map((btn, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.2 }}
                        whileHover={{ 
                          scale: 1.03,
                          rotateY: 5,
                          transition: { duration: 0.2 }
                        }} 
                        whileTap={{ scale: 0.97 }}
                      >
                        <Card sx={{
                          mb: 2,
                          background: btn.gradient,
                          borderRadius: 3,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          '&:hover': {
                            boxShadow: '0 15px 40px rgba(0,0,0,0.25)'
                          }
                        }} onClick={btn.action}>
                          <CardContent sx={{ p: 3, color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <btn.icon sx={{ fontSize: 28 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{btn.label}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{btn.desc}</Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
              <Card sx={{ 
                background: 'rgba(255,255,255,0.95)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#28a745' }} />
                    Recent Activity
                  </Typography>
                  
                  {[
                    { text: 'New user registered', time: '2 min ago', color: '#ff6b6b', icon: People },
                    { text: 'Quiz completed', time: '5 min ago', color: '#667eea', icon: Quiz },
                    { text: 'New quiz created', time: '1 hour ago', color: '#28a745', icon: Add }
                  ].map((activity, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 1.6 + index * 0.15, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 2, 
                        p: 3, 
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${activity.color}15, ${activity.color}05)`,
                        border: `2px solid ${activity.color}20`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          background: activity.color
                        }
                      }}>
                        <Box sx={{ 
                          bgcolor: activity.color, 
                          borderRadius: '50%', 
                          p: 1, 
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <activity.icon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{activity.text}</Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>System notification</Typography>
                        </Box>
                        <Chip 
                          label={activity.time} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${activity.color}20`, 
                            color: activity.color,
                            fontWeight: 'bold',
                            borderRadius: 2
                          }} 
                        />
                      </Box>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
              Quiz Management System
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Empowering education through interactive assessments
            </Typography>
          </Box>
        </motion.div>

      </Box>
    </Box>
  );
};

export default AdminDashboard;
