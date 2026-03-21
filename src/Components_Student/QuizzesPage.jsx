import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Grid, Chip, TextField, InputAdornment, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Quiz, Person, ArrowBack, Timer, CheckCircle, Warning, Star, Search, PlayArrow } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const QuizzesPage = ({ user }) => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    const handler = () => { if (!document.fullscreenElement) { Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please stay in fullscreen!' }); elem.requestFullscreen?.(); } };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const { data: quizzes, loading, error } = useCache('user-quizzes', async () => {
    const res = await api.get('/api/users/quizzes');
    return (res.data || []).filter((q, i, a) => i === a.findIndex(x => x?.title === q?.title));
  });

  const filtered = (quizzes || []).filter(q => q?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || q?.description?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 500, height: 500, background: '#667eea', top: '-15%', left: '-10%' }} />
      <Orb style={{ width: 400, height: 400, background: '#764ba2', top: '40%', right: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#f093fb', bottom: '-10%', left: '35%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>
            Back
          </Button>
        </motion.div>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>🎯 Quiz Collection</Typography>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <Person sx={{ color: 'white' }} />
        </Avatar>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '1.8rem', md: '3rem' } }}>🚀 Explore Quizzes</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Discover engaging quizzes to test and expand your knowledge</Typography>
          </Box>
        </motion.div>

        {/* Search */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TextField
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 500, width: '100%',
              '& .MuiOutlinedInput-root': { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)' },
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> }}
          />
        </Box>

        {error ? (
          <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', py: 8 }}><Typography variant="h6">Failed to load quizzes</Typography></Box>
        ) : loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#667eea' }} /></Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filtered.map((quiz, i) => (
                <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -8 }}>
                    <Box sx={{ ...glass, p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer', transition: 'all 0.3s', '&:hover': { background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(102,126,234,0.4)' } }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Quiz sx={{ color: '#667eea', fontSize: 24 }} />
                      </Box>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{quiz.title}</Typography>
                      {quiz.description && <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.5, flex: 1 }}>{quiz.description}</Typography>}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {quiz.timer && <Chip icon={<Timer sx={{ fontSize: '14px !important', color: '#ffb74d !important' }} />} label={`${quiz.timer} min`} size="small" sx={{ background: 'rgba(255,183,77,0.15)', color: '#ffb74d', border: '1px solid rgba(255,183,77,0.3)', height: 24, fontSize: 12 }} />}
                        <Chip label="MCQ" size="small" sx={{ background: 'rgba(102,126,234,0.15)', color: '#8fa8f5', border: '1px solid rgba(102,126,234,0.3)', height: 24, fontSize: 12 }} />
                      </Box>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button fullWidth startIcon={<PlayArrow />} onClick={() => { setSelectedQuizId(quiz.id); setShowInstructions(true); }}
                          sx={{ py: 1.2, borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', boxShadow: '0 4px 20px rgba(102,126,234,0.3)', '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b46c1)' } }}>
                          Start Quiz
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {filtered.length === 0 && !loading && (quizzes || []).length > 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Search sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No quizzes found for "{searchQuery}"</Typography>
          </Box>
        )}
        {!(quizzes || []).length && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Quiz sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No quizzes available yet</Typography>
          </Box>
        )}
      </Container>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onClose={() => setShowInstructions(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: 'rgba(30,20,60,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: 'white' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, textAlign: 'center', color: 'white' }}>📋 Quiz Instructions</DialogTitle>
        <DialogContent>
          <List>
            {[
              { icon: Timer, color: '#FF9800', primary: 'Time Management', secondary: 'Read each question carefully before answering.' },
              { icon: CheckCircle, color: '#4CAF50', primary: 'Answer Selection', secondary: 'Select only one answer per question.' },
              { icon: Warning, color: '#FF5722', primary: 'Submission', secondary: 'Once submitted, you cannot make changes.' },
              { icon: Star, color: '#9C27B0', primary: 'Best Practices', secondary: 'Stay focused and trust your knowledge!' },
              {icon: Person, color: '#2196F3', primary: 'Support', secondary: 'Contact support if you encounter any issues.' },
              {icon: Quiz, color: '#673AB7', primary: 'Enjoy!', secondary: 'Have fun and do your best!' },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><Box sx={{ width: 36, height: 36, borderRadius: '50%', background: `${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><item.icon sx={{ color: item.color, fontSize: 20 }} /></Box></ListItemIcon>
                <ListItemText primary={<Typography sx={{ color: 'white', fontWeight: 600 }}>{item.primary}</Typography>} secondary={<Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.secondary}</Typography>} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setShowInstructions(false)} sx={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 3 }}>Cancel</Button>
          <Button onClick={() => { setShowInstructions(false); navigate(`/quiz/${selectedQuizId}`); }} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 2, px: 3, fontWeight: 700, '&:hover': { background: 'linear-gradient(135deg, #5a67d8, #6b46c1)' } }}>
            🚀 Start Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizzesPage;
