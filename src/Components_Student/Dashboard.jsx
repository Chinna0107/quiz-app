import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar,
  Avatar, Radio, RadioGroup, FormControlLabel, LinearProgress, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Quiz, Person, ExitToApp, ArrowBack, TrendingUp, EmojiEvents, 
  School, PlayArrow, CheckCircle, Schedule, Info, Timer, Warning, Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const [quizzesResponse, statsResponse] = await Promise.all([
        api.get('/api/users/quizzes'),
        api.get('/api/users/user-stats')
      ]);
      
      const uniqueQuizzes = quizzesResponse.data.filter((quiz, index, arr) => 
        index === arr.findIndex(q => q.title === quiz.title)
      );
      setQuizzes(uniqueQuizzes);
      
      const { quizzesAttempted, averageScore } = statsResponse.data;
      setStats({ 
        totalQuizzes: uniqueQuizzes.length, 
        completedQuizzes: quizzesAttempted, 
        averageScore: averageScore 
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Fallback to default values if API fails
      setStats({ 
        totalQuizzes: quizzes.length, 
        completedQuizzes: 0, 
        averageScore: 0 
      });
    }
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };





  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        zIndex: 0
      }
    }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1
        }} 
        elevation={0}
      >
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" sx={{ 
              flexGrow: 1, 
              color: 'white', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #e3f2fd)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ✨ Quiz Dashboard
            </Typography>
          </motion.div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }} 
                onClick={() => navigate('/profile')}
              >
                <Person sx={{ color: 'white' }} />
              </Avatar>
            </motion.div>
            <Typography sx={{ color: 'white', fontWeight: 500 }}>{user?.name}</Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                startIcon={<ExitToApp />}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white', 
                mb: 2, 
                fontWeight: 'bold',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Welcome back, {user?.name}! 🎓
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Ready to challenge yourself? Let's continue your learning journey!
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ mb: { xs: 4, md: 6 }, maxWidth: '900px', mx: 'auto' }}>
          {[
            { 
              label: 'Total Quizzes', 
              value: stats.totalQuizzes, 
              color: '#667eea', 
              icon: School,
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            { 
              label: 'Completed', 
              value: stats.completedQuizzes, 
              color: '#4CAF50', 
              icon: CheckCircle,
              gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
            },
            { 
              label: 'Average Score', 
              value: `${stats.averageScore}%`, 
              color: '#FF9800', 
              icon: TrendingUp,
              gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
            }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.98)', 
                  backdropFilter: 'blur(30px)', 
                  textAlign: 'center', 
                  borderRadius: 6, 
                  p: { xs: 3, md: 4 }, 
                  boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'perspective(1000px) rotateX(2deg)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: item.gradient,
                    borderRadius: '6px 6px 0 0'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${item.color}08, transparent)`,
                    pointerEvents: 'none'
                  }
                }}>
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Box sx={{ 
                      width: 85, 
                      height: 85, 
                      borderRadius: '50%', 
                      background: item.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: `0 15px 40px ${item.color}50`,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        background: item.gradient,
                        opacity: 0.3,
                        filter: 'blur(8px)',
                        zIndex: -1
                      }
                    }}>
                      <item.icon sx={{ fontSize: 42, color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    </Box>
                    <Typography variant="h2" sx={{ 
                      fontWeight: '800', 
                      color: '#333',
                      mb: 1,
                      background: item.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      letterSpacing: '-0.02em'
                    }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ color: '#666', fontWeight: 500, fontSize: '1.1rem' }}>
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Navigation Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {[
            {
              title: 'Take Quizzes',
              description: 'Browse and take available quizzes to test your knowledge',
              icon: Quiz,
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              path: '/quizzes'
            },
            {
              title: 'My Results',
              description: 'View your quiz results and track your progress',
              icon: EmojiEvents,
              gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              path: '/results'
            },
            {
              title: 'Profile',
              description: 'Manage your account settings and personal information',
              icon: Person,
              gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              path: '/profile'
            },
            {
              title: 'Settings',
              description: 'Customize your preferences and account settings',
              icon: Star,
              gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              path: '/settings'
            }
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -15, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  onClick={() => navigate(card.path)}
                  sx={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 5, 
                    p: { xs: 3, md: 4 }, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                      <card.icon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold',
                      color: '#333',
                      mb: 2,
                      background: card.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {card.title}
                    </Typography>
                    
                    <Typography sx={{ 
                      color: '#666',
                      fontSize: '1rem',
                      lineHeight: 1.5,
                      flex: 1
                    }}>
                      {card.description}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      sx={{
                        mt: 3,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        background: card.gradient,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        '&:hover': {
                          boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Box>
  );
};

export default Dashboard;
