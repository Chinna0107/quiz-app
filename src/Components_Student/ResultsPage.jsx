import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar,
  Avatar, Chip, LinearProgress
} from '@mui/material';
import { ArrowBack, EmojiEvents, TrendingUp, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';

const ResultsPage = ({ user }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/api/users/results');
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    }}>
      <AppBar position="static" sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }} elevation={0}>
        <Toolbar>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/dashboard')} 
            sx={{ color: 'white', mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h5" sx={{ 
            flexGrow: 1, 
            color: 'white', 
            fontWeight: 'bold'
          }}>
            🏆 My Quiz Results
          </Typography>
          <Avatar 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <Typography variant="h6">Loading results...</Typography>
          </Box>
        ) : results.length === 0 ? (
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
            {results.map((result, index) => (
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
                    borderRadius: 4, 
                    p: 2, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    height: '100%'
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