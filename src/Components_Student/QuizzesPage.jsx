import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, CardMedia, Grid, Button, AppBar, Toolbar,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, TextField, InputAdornment, CircularProgress, Chip, Divider, Badge
} from '@mui/material';
import { 
  Quiz, Person, ExitToApp, ArrowBack, Timer, CheckCircle, Warning, Star, Search, PlayArrow, School, TrendingUp, EmojiEvents, AccessTime, Assignment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const QuizzesPage = ({ user }) => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedQuizForStart, setSelectedQuizForStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const quizImages = [
    'https://res.cloudinary.com/dgyykbmt6/image/upload/v1772647765/1_vcbzgr.png',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'
  ];
  
  useEffect(() => {
    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please stay in fullscreen mode!' });
      enterFullscreen();
    }
  };
  
  const { data: quizzes, loading, error } = useCache(
    'user-quizzes',
    async () => {
      const response = await api.get('/api/users/quizzes');
      const data = response.data || [];
      return data.filter((quiz, index, arr) => 
        index === arr.findIndex(q => q?.title === quiz?.title)
      );
    }
  );

  const filteredQuizzes = (quizzes || []).filter(quiz => {
    if (!quiz?.title) return false;
    return quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const showQuizInstructions = (quizId) => {
    setSelectedQuizForStart(quizId);
    setShowInstructions(true);
  };

  const startQuiz = () => {
    setShowInstructions(false);
    navigate(`/quiz/${selectedQuizForStart}`);
    setSelectedQuizForStart(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    }}>
      <AppBar position="static" sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }} elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/dashboard')} 
              sx={{ 
                color: 'white', 
                mr: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </motion.div>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #e3f2fd)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}>
              🎯 Quiz Collection
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 300
            }}>
              Challenge yourself with our curated quizzes
            </Typography>
          </Box>
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
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                mb: 2, 
                fontWeight: 'bold',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🚀 Explore Quizzes
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 300,
                maxWidth: 700,
                mx: 'auto',
                mb: 4
              }}
            >
              Discover engaging quizzes designed to test and expand your knowledge across various topics
            </Typography>
            
            {/* Stats Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
              {[
                { label: 'Available', value: filteredQuizzes.length, icon: Assignment, color: '#667eea' },
                { label: 'Categories', value: '5+', icon: School, color: '#4CAF50' },
                { label: 'Difficulty', value: 'All Levels', icon: TrendingUp, color: '#FF9800' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Chip
                    icon={<stat.icon sx={{ fontSize: 18, color: stat.color }} />}
                    label={`${stat.value} ${stat.label}`}
                    sx={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      fontSize: '0.9rem'
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* Enhanced Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
            <TextField
              placeholder="🔍 Search for quizzes by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 700,
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  fontSize: '1.1rem',
                  py: 1,
                  border: '2px solid rgba(255,255,255,0.3)',
                  '&:hover': { 
                    background: 'white',
                    border: '2px solid rgba(102, 126, 234, 0.3)'
                  },
                  '&.Mui-focused': {
                    border: '2px solid #667eea',
                    boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#667eea', fontSize: 24 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </motion.div>
        {error ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Failed to load quizzes</Typography>
            <Typography>Please try refreshing the page</Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6">Loading quizzes...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredQuizzes.map((quiz, index) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.03,
                    rotateY: 2,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.98)', 
                    backdropFilter: 'blur(30px)',
                    borderRadius: 6, 
                    p: 0, 
                    boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    height: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transform: 'perspective(1000px)',
                    '&:hover': {
                      boxShadow: '0 35px 100px rgba(0,0,0,0.2)',
                      '& .quiz-image': {
                        transform: 'scale(1.1)'
                      },
                      '& .quiz-title': {
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }
                    }
                  }}>
                    <CardMedia
                      component="img"
                      className="quiz-image"
                      height="180"
                      image={quiz.image || quizImages[index % quizImages.length]}
                      alt={quiz.title}
                      sx={{
                        transition: 'transform 0.3s ease',
                        objectFit: 'cover'
                      }}
                    />
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      <Typography 
                        variant="h5" 
                        className="quiz-title"
                        sx={{ 
                          fontWeight: 'bold',
                          color: '#333',
                          mb: 2,
                          fontSize: '1.3rem',
                          lineHeight: 1.3,
                          transition: 'all 0.3s ease',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {quiz.title}
                      </Typography>
                      
                      <Divider sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea, #764ba2)', height: 2, borderRadius: 1 }} />
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<AccessTime sx={{ fontSize: 16 }} />}
                          label="60 min"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.2))',
                            color: '#667eea',
                            fontWeight: 'bold',
                            border: '1px solid rgba(102, 126, 234, 0.3)'
                          }}
                        />
                        <Chip
                          icon={<Star sx={{ fontSize: 16 }} />}
                          label="Medium"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2))',
                            color: '#4CAF50',
                            fontWeight: 'bold',
                            border: '1px solid rgba(76, 175, 80, 0.3)'
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => showQuizInstructions(quiz.id)}
                            sx={{
                              py: 2,
                              borderRadius: 3,
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              textTransform: 'none',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)'
                              }
                            }}
                          >
                            Start Quiz
                          </Button>
                        </motion.div>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {filteredQuizzes.length === 0 && (quizzes || []).length > 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'white'
          }}>
            <Search sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              No Quizzes Found
            </Typography>
            <Typography>
              Try a different search term
            </Typography>
          </Box>
        )}

        {!(quizzes || []).length && !loading && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'white'
          }}>
            <Quiz sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              No Quizzes Available
            </Typography>
            <Typography>
              Check back later for new challenges!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Quiz Instructions Modal */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontSize: '1.8rem',
          fontWeight: 'bold'
        }}>
          📋 Quiz Instructions
        </DialogTitle>
        
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <Timer sx={{ color: '#FF9800' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Time Management" 
                secondary="Take your time to read each question carefully."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#4CAF50' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Answer Selection" 
                secondary="Select only one answer per question."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Warning sx={{ color: '#FF5722' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Submission" 
                secondary="Once submitted, you cannot make changes."
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Star sx={{ color: '#9C27B0' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Best Practices" 
                secondary="Stay focused and trust your knowledge!"
              />
            </ListItem>
          </List>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowInstructions(false)}>
            Cancel
          </Button>
          <Button 
            onClick={startQuiz}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8, #6b46c1)'
              }
            }}
          >
            🚀 Start Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizzesPage;