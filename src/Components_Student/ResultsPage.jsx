import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Grid, Chip, LinearProgress, CircularProgress } from '@mui/material';
import { ArrowBack, EmojiEvents, TrendingUp, CalendarToday, Person, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';
import { useCache } from '../hooks/useCache';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const getScoreColor = (p) => p >= 80 ? '#4CAF50' : p >= 60 ? '#FF9800' : '#f44336';
const getGrade = (p) => p >= 90 ? 'A+' : p >= 80 ? 'A' : p >= 70 ? 'B' : p >= 60 ? 'C' : 'F';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { data: results, loading } = useCache('user-results', async () => (await api.get('/api/users/results')).data);

  const avgPercentage = (results || []).length > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const bestScore = (results || []).length > 0 ? Math.max(...results.map(r => r.percentage)) : 0;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 500, height: 500, background: '#667eea', top: '-15%', left: '-10%' }} />
      <Orb style={{ width: 400, height: 400, background: '#764ba2', top: '40%', right: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#f093fb', bottom: '-10%', left: '35%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Back</Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>🏆 My Results</Typography>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}><Person sx={{ color: 'white' }} /></Avatar>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '1.8rem', md: '3rem' } }}>Quiz Performance</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Track your progress and celebrate your achievements</Typography>
          </Box>
        </motion.div>

        {/* Summary stats */}
        {!loading && (results || []).length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
            {[
              { label: 'Total Quizzes', value: results.length, icon: EmojiEvents, color: '#667eea' },
              { label: 'Average Score', value: `${avgPercentage}%`, icon: TrendingUp, color: '#FF9800' },
              { label: 'Best Score', value: `${bestScore}%`, icon: Star, color: '#4CAF50' },
            ].map((s, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                  <Box sx={{ ...glass, p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                    <Box sx={{ width: 52, height: 52, borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                      <s.icon sx={{ color: s.color, fontSize: 26 }} />
                    </Box>
                    <Typography sx={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{s.value}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#667eea' }} /></Box>
        ) : !(results || []).length ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmojiEvents sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>No results yet — take some quizzes!</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {results.map((result, i) => (
              <Grid item xs={12} sm={6} md={4} key={result.id}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}>
                  <Box sx={{ ...glass, p: 3, position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${getScoreColor(result.percentage)}, ${getScoreColor(result.percentage)}88)` }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15, flex: 1, pr: 1, lineHeight: 1.3 }}>{result.quiz_title}</Typography>
                      <Chip label={getGrade(result.percentage)} size="small" sx={{ background: getScoreColor(result.percentage), color: 'white', fontWeight: 800, fontSize: 13 }} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Score</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{result.score}/{result.total_questions}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={result.percentage} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${getScoreColor(result.percentage)}, ${getScoreColor(result.percentage)}cc)`, borderRadius: 3 } }} />
                      <Typography sx={{ textAlign: 'center', mt: 1, fontWeight: 700, color: getScoreColor(result.percentage), fontSize: 20 }}>{result.percentage}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                        {new Date(result.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ResultsPage;
