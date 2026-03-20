import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Avatar, Chip, Grid, CircularProgress } from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, EmojiEvents, TrendingUp, People, PictureAsPdf, TableChart, Quiz } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';

const Orb = ({ style }) => (
  <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', ...style }} />
);

const glass = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 };

const QuizResults = ({ user }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('adminToken'); navigate('/'); };

  useEffect(() => {
    api.get('/api/users/quizzes').then(res => {
      setQuizzes(res.data.filter((q, i, a) => i === a.findIndex(x => x.title === q.title)));
    }).catch(() => {});
  }, []);

  const fetchQuizResults = async (quizId) => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/results');
      const title = quizzes.find(q => q.id === quizId)?.title;
      const results = res.data.filter(r => r.quiz_title === title);
      setQuizResults(results);
      setFilteredResults(results);
      setActiveFilter('all');
    } catch { setQuizResults([]); setFilteredResults([]); }
    finally { setLoading(false); }
  };

  const handleQuizSelect = (quiz) => { setSelectedQuiz(quiz); fetchQuizResults(quiz.id); };

  const getStats = () => {
    if (!quizResults.length) return { totalAttempts: 0, avgScore: 0, passRate: 0 };
    return {
      totalAttempts: quizResults.length,
      avgScore: Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length),
      passRate: Math.round((quizResults.filter(r => r.percentage >= 70).length / quizResults.length) * 100),
    };
  };

  const handleFilter = (f) => {
    setActiveFilter(f);
    const map = { excellent: r => r.percentage >= 90, good: r => r.percentage >= 70 && r.percentage < 90, average: r => r.percentage >= 50 && r.percentage < 70, poor: r => r.percentage < 50 };
    setFilteredResults(f === 'all' ? quizResults : quizResults.filter(map[f]));
  };

  const exportToPDF = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Results - ${selectedQuiz.title}</title><style>body{font-family:Arial;margin:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:10px}th{background:#667eea;color:white}</style></head><body><h1>${selectedQuiz.title} - Results</h1><table><thead><tr><th>Name</th><th>Email</th><th>Score</th><th>%</th><th>Date</th></tr></thead><tbody>${filteredResults.map(r => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.score}/${r.total_questions}</td><td>${r.percentage}%</td><td>${new Date(r.completed_at).toLocaleDateString()}</td></tr>`).join('')}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };

  const exportToExcel = () => {
    const csv = ['Name,Email,Score,Total,Percentage,Date', ...filteredResults.map(r => `${r.name},${r.email},${r.score},${r.total_questions},${r.percentage}%,${new Date(r.completed_at).toLocaleDateString()}`)].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `results-${selectedQuiz.title.replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  const stats = getStats();
  const scoreColor = (p) => p >= 80 ? '#4CAF50' : p >= 60 ? '#FF9800' : '#f44336';

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)', position: 'relative', overflow: 'hidden' }}>
      <Orb style={{ width: 400, height: 400, background: '#ff6b6b', top: '-10%', left: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#764ba2', top: '30%', right: '-8%' }} />
      <Orb style={{ width: 300, height: 300, background: '#ee5a24', bottom: '-5%', left: '30%' }} />

      {/* Navbar */}
      <Box sx={{ ...glass, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', px: { xs: 2, md: 4 }, py: 1.5, position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Back</Button>
        <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'white', flexGrow: 1, textAlign: 'center' }}>📊 Quiz Results</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', width: 36, height: 36 }}><AdminPanelSettings sx={{ color: 'white', fontSize: 18 }} /></Avatar>
          <Button onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { background: 'rgba(255,255,255,0.1)', color: 'white' } }}>Logout</Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>Performance Dashboard 📈</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Monitor student performance and track quiz analytics</Typography>
          </Box>
        </motion.div>

        {/* Quiz selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{ ...glass, p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #ff6b6b, #ee5a24)' }} />
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Select Quiz to Analyze</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {quizzes.map(quiz => (
                <motion.div key={quiz.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button onClick={() => handleQuizSelect(quiz)}
                    sx={{ px: 2.5, py: 1, borderRadius: 2, fontWeight: 600, fontSize: 13, background: selectedQuiz?.id === quiz.id ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'rgba(255,255,255,0.1)', color: 'white', border: selectedQuiz?.id === quiz.id ? 'none' : '1px solid rgba(255,255,255,0.2)', boxShadow: selectedQuiz?.id === quiz.id ? '0 4px 20px rgba(255,107,107,0.4)' : 'none', '&:hover': { background: selectedQuiz?.id === quiz.id ? 'linear-gradient(135deg, #ff5252, #d84315)' : 'rgba(255,255,255,0.18)' } }}>
                    {quiz.title}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {selectedQuiz && (
          <>
            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Attempts', value: stats.totalAttempts, icon: People, color: '#667eea' },
                { label: 'Average Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: '#FF9800' },
                { label: 'Pass Rate', value: `${stats.passRate}%`, icon: EmojiEvents, color: '#4CAF50' },
              ].map((s, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                    <Box sx={{ ...glass, p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                      <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                        <s.icon sx={{ color: s.color, fontSize: 24 }} />
                      </Box>
                      <Typography sx={{ fontSize: 30, fontWeight: 800, color: 'white' }}>{s.value}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{s.label}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Results table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Box sx={{ ...glass, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Results: {selectedQuiz.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    {[{ key: 'all', label: 'All', color: '#667eea' }, { key: 'excellent', label: '90%+', color: '#4CAF50' }, { key: 'good', label: '70-89%', color: '#2196F3' }, { key: 'average', label: '50-69%', color: '#FF9800' }, { key: 'poor', label: '<50%', color: '#f44336' }].map(f => (
                      <Button key={f.key} size="small" onClick={() => handleFilter(f.key)}
                        sx={{ borderRadius: 2, px: 1.5, py: 0.5, fontSize: 12, fontWeight: 600, background: activeFilter === f.key ? f.color : 'rgba(255,255,255,0.08)', color: activeFilter === f.key ? 'white' : 'rgba(255,255,255,0.6)', border: `1px solid ${activeFilter === f.key ? f.color : 'rgba(255,255,255,0.15)'}`, '&:hover': { background: `${f.color}30`, color: 'white' } }}>
                        {f.label}
                      </Button>
                    ))}
                    <Button size="small" startIcon={<PictureAsPdf sx={{ fontSize: 14 }} />} onClick={exportToPDF} sx={{ borderRadius: 2, px: 1.5, py: 0.5, fontSize: 12, background: 'rgba(244,67,54,0.2)', color: '#f44336', border: '1px solid rgba(244,67,54,0.3)', '&:hover': { background: 'rgba(244,67,54,0.35)' } }}>PDF</Button>
                    <Button size="small" startIcon={<TableChart sx={{ fontSize: 14 }} />} onClick={exportToExcel} sx={{ borderRadius: 2, px: 1.5, py: 0.5, fontSize: 12, background: 'rgba(76,175,80,0.2)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.3)', '&:hover': { background: 'rgba(76,175,80,0.35)' } }}>CSV</Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress sx={{ color: '#ff6b6b' }} /></Box>
                ) : filteredResults.length > 0 ? (
                  <>
                    {/* Table header */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 2, px: 2, py: 1.5, background: 'rgba(255,107,107,0.15)', borderRadius: 2, mb: 1 }}>
                      {['Student', 'Email', 'Score', 'Grade', 'Date'].map((h, i) => (
                        <Typography key={i} sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 12, textAlign: i > 1 ? 'center' : 'left' }}>{h}</Typography>
                      ))}
                    </Box>
                    {filteredResults.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 2, px: 2, py: 1.5, borderRadius: 2, mb: 0.5, background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent', '&:hover': { background: 'rgba(255,255,255,0.08)' }, transition: 'all 0.2s', alignItems: 'center' }}>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{r.name}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>{r.score}/{r.total_questions}</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Chip label={`${r.percentage}%`} size="small" sx={{ background: `${scoreColor(r.percentage)}25`, color: scoreColor(r.percentage), border: `1px solid ${scoreColor(r.percentage)}50`, fontWeight: 700, fontSize: 12 }} />
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center' }}>{new Date(r.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <EmojiEvents sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>{activeFilter === 'all' ? 'No results yet' : `No ${activeFilter} results`}</Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </>
        )}

        {!selectedQuiz && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Quiz sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Select a quiz above to view results</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default QuizResults;
