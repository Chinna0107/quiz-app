import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar,
  Avatar, Chip, LinearProgress, CircularProgress
} from '@mui/material';
import { ArrowBack, EmojiEvents, TrendingUp, CalendarToday, Person, ExitToApp, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const ResultsPage = ({ user }) => {
  const navigate = useNavigate();
  const { data: results, loading } = useCache(
    'user-results',
    async () => {
      const response = await api.get('/api/users/results');
      return response.data;
    }
  );

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#f44336';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'F';
  };

  const avgPercentage = (results || []).length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) 
    : 0;

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
      <AppBar position="static" sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1
      }} elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/dashboard')} 
              sx={{ 
                color: 'white', 
                mr: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                px: 3,
                '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              Back to Dashboard
            </Button>
          </motion.div>
          <Typography variant="h5" sx={{ 
            flexGrow: 1, 
            color: 'white', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🏆 My Quiz Results
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Person sx={{ color: 'white' }} />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        {/* Summary Stats */}
        {!loading && (results || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Quizzes', value: (results || []).length, icon: EmojiEvents, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
                { label: 'Average Score', value: `${avgPercentage}%`, icon: TrendingUp, gradient: 'linear-gradient(135deg, #FF9800, #F57C00)' },
                { label: 'Best Score', value: `${(results || []).length > 0 ? Math.max(...results.map(r => r.percentage)) : 0}%`, icon: Star, gradient: 'linear-gradient(135deg, #4CAF50, #45a049)' }
              ].map((stat, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(20px)', 
                    textAlign: 'center', 
                    borderRadius: 5, 
                    p: 3, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <CardContent>
                      <Box sx={{ 
                        width: 70, 
                        height: 70, 
                        borderRadius: '50%', 
                        background: stat.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }}>
                        <stat.icon sx={{ fontSize: 35, color: 'white' }} />
                      </Box>
                      <Typography variant="h3" sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        mb: 1,
                        background: stat.gradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ color: '#666', fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6">Loading results...</Typography>
          </Box>
        ) : !(results || []).length ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <EmojiEvents sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              No Results Yet
            </Typography>
            <Typography>
              Take some quizzes to see your results here!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {(results || []).map((result, index) => (
              <Grid item xs={12} md={6} lg={4} key={result.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 5, 
                    p: 3, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${getScoreColor(result.percentage)}, ${getScoreColor(result.percentage)}dd)`
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          color: '#333',
                          flex: 1
                        }}>
                          {result.quiz_title}
                        </Typography>
                        <Chip 
                          label={getGrade(result.percentage)}
                          sx={{ 
                            background: getScoreColor(result.percentage),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ color: '#666' }}>Score</Typography>
                          <Typography sx={{ fontWeight: 600, color: '#333' }}>
                            {result.score}/{result.total_questions}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={result.percentage} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${getScoreColor(result.percentage)}, ${getScoreColor(result.percentage)}dd)`,
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Typography sx={{ 
                          textAlign: 'center', 
                          mt: 1, 
                          fontWeight: 600,
                          color: getScoreColor(result.percentage),
                          fontSize: '1.1rem'
                        }}>
                          {result.percentage}%
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(result.completed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ResultsPage;