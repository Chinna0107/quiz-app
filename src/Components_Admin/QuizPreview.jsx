import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, AppBar, Toolbar, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Chip
} from '@mui/material';
import { ArrowBack, AdminPanelSettings, Quiz, Visibility, Edit } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCache } from '../hooks/useCache';
import api from '../config/api';

const QuizPreview = ({ user }) => {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: quizzes, loading } = useCache(
    'admin-quizzes',
    async () => {
      const response = await api.get('/api/users/quizzes');
      return response.data || [];
    }
  );

  const handlePreview = (quiz) => {
    setSelectedQuiz(quiz);
    setShowPreview(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }} elevation={0}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'white', mr: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Active Quizzes Preview</Typography>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
            <AdminPanelSettings />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          mb: 4, 
          textAlign: 'center', 
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          📚 Active Quizzes Collection
        </Typography>
        
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Total Active Quizzes: {(quizzes || []).length}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Manage and preview all your quiz content
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <Typography variant="h6">Loading quizzes...</Typography>
          </Box>
        ) : (
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Grid container spacing={3}>
              {(quizzes || []).map((quiz, index) => (
                <Grid item xs={12} sm={6} lg={4} key={quiz.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.98)', 
                      backdropFilter: 'blur(20px)', 
                      borderRadius: 4,
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)'
                      },
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => handlePreview(quiz)}
                    >
                      <CardContent sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        p: 3
                      }}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '50%',
                          p: 2,
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }}>
                          <Quiz sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            mb: 2,
                            height: '3.6rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {quiz.title}
                        </Typography>
                        
                        <Chip 
                          label={`ID: #${quiz.id}`}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea15, #764ba205)',
                            color: '#667eea',
                            fontWeight: 'bold',
                            border: '1px solid #667eea30'
                          }}
                          size="small" 
                        />
                      </CardContent>
                    </Card>
                </motion.div>
              </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {!loading && !(quizzes || []).length && (
          <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
            <Quiz sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>No Active Quizzes</Typography>
            <Typography>Create your first quiz to get started!</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/admin/create-quiz')}
              sx={{ mt: 2, background: 'rgba(255,255,255,0.2)' }}
            >
              Create Quiz
            </Button>
          </Box>
        )}
      </Box>

      {/* Quiz Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #667eea15, #764ba205)',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Quiz sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {selectedQuiz?.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Quiz Preview
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
            Description:
          </Typography>
          <Typography sx={{ mb: 3, color: '#666' }}>
            {selectedQuiz?.description || 'No description available'}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
            Quiz Details:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Quiz ID" 
                secondary={selectedQuiz?.id}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Status" 
                secondary={<Chip label="Active" color="success" size="small" />}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Created" 
                secondary={selectedQuiz?.created_at ? new Date(selectedQuiz.created_at).toLocaleDateString() : 'Unknown'}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowPreview(false);
              navigate(`/admin/edit-quiz/${selectedQuiz?.id}`);
            }}
            sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
          >
            Edit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizPreview;