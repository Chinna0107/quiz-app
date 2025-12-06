import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import { 
  Quiz, Person, ExitToApp, ArrowBack, Timer, CheckCircle, Warning, Star, Search
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const QuizzesPage = ({ user }) => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedQuizForStart, setSelectedQuizForStart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
            📚 Available Quizzes
          </Typography>
          <Avatar 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', cursor: 'pointer' }} 
            onClick={() => navigate('/profile')}
          >
            <Person sx={{ color: 'white' }} />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 600,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 3,
                '&:hover': { background: 'white' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#667eea' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
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
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4, 
                    p: 3, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mx: 'auto'
                      }}>
                        <Quiz sx={{ fontSize: 30, color: 'white' }} />
                      </Box>
                      
                      <Typography variant="h6" sx={{ 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#333',
                        mb: 2
                      }}>
                        {quiz.title}
                      </Typography>
                      
                      <Typography sx={{ 
                        color: '#666',
                        textAlign: 'center',
                        mb: 3,
                        flex: 1
                      }}>
                        {quiz.description || 'Test your knowledge with this comprehensive quiz'}
                      </Typography>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => showQuizInstructions(quiz.id)}
                        sx={{
                          py: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                          }
                        }}
                      >
                        Start Quiz
                      </Button>
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