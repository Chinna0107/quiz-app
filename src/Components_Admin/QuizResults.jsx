import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, Toolbar, Avatar, Button, Chip, Grid } from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, EmojiEvents, TrendingUp, People, PictureAsPdf, TableChart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../config/api';

const QuizResults = ({ user }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/api/users/quizzes');
      const uniqueQuizzes = response.data.filter((quiz, index, self) => 
        index === self.findIndex(q => q.title === quiz.title)
      );
      setQuizzes(uniqueQuizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const fetchQuizResults = async (quizId) => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/results');
      const results = response.data.filter(result => result.quiz_title === quizzes.find(q => q.id === quizId)?.title);
      setQuizResults(results);
      setFilteredResults(results);
      setActiveFilter('all');
    } catch (error) {
      console.error('Failed to fetch quiz results:', error);
      setQuizResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuizResults(quiz.id);
  };

  const getStatsForQuiz = (quizTitle) => {
    const results = quizResults.filter(r => r.quiz_title === quizTitle);
    if (results.length === 0) return { totalAttempts: 0, avgScore: 0, passRate: 0 };
    
    const totalAttempts = results.length;
    const avgScore = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts);
    const passRate = Math.round((results.filter(r => r.percentage >= 70).length / totalAttempts) * 100);
    
    return { totalAttempts, avgScore, passRate };
  };

  const handleFilter = (filterType) => {
    setActiveFilter(filterType);
    let filtered = [...quizResults];
    
    switch (filterType) {
      case 'excellent':
        filtered = quizResults.filter(result => result.percentage >= 90);
        break;
      case 'good':
        filtered = quizResults.filter(result => result.percentage >= 70 && result.percentage < 90);
        break;
      case 'average':
        filtered = quizResults.filter(result => result.percentage >= 50 && result.percentage < 70);
        break;
      case 'poor':
        filtered = quizResults.filter(result => result.percentage < 50);
        break;
      default:
        filtered = quizResults;
    }
    
    setFilteredResults(filtered);
  };

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Quiz Results - ${selectedQuiz.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #667eea; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-card { text-align: center; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Quiz Results Report</h1>
          <h2>${selectedQuiz.title}</h2>
          <div class="stats">
            <div class="stat-card">
              <h3>${getStatsForQuiz(selectedQuiz.title).totalAttempts}</h3>
              <p>Total Attempts</p>
            </div>
            <div class="stat-card">
              <h3>${getStatsForQuiz(selectedQuiz.title).avgScore}%</h3>
              <p>Average Score</p>
            </div>
            <div class="stat-card">
              <h3>${getStatsForQuiz(selectedQuiz.title).passRate}%</h3>
              <p>Pass Rate</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Completed Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredResults.map(result => `
                <tr>
                  <td>${result.name}</td>
                  <td>${result.email}</td>
                  <td>${result.score}/${result.total_questions}</td>
                  <td>${result.percentage}%</td>
                  <td>${new Date(result.completed_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 30px; text-align: center; color: #666;">
            Generated on ${new Date().toLocaleDateString()} | Filter: ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
          </p>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Quiz Results Report'],
      ['Quiz Title:', selectedQuiz.title],
      ['Generated:', new Date().toLocaleDateString()],
      ['Filter:', activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)],
      [''],
      ['Statistics'],
      ['Total Attempts', getStatsForQuiz(selectedQuiz.title).totalAttempts],
      ['Average Score', `${getStatsForQuiz(selectedQuiz.title).avgScore}%`],
      ['Pass Rate', `${getStatsForQuiz(selectedQuiz.title).passRate}%`],
      [''],
      ['Student Name', 'Email', 'Score', 'Total Questions', 'Percentage', 'Completed Date'],
      ...filteredResults.map(result => [
        result.name,
        result.email,
        result.score,
        result.total_questions,
        `${result.percentage}%`,
        new Date(result.completed_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quiz-results-${selectedQuiz.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onClick={() => navigate('/admin')} 
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
            📊 Quiz Results Analytics
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <AdminPanelSettings sx={{ color: 'white' }} />
            </Avatar>
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
                  '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                Logout
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
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
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              Quiz Performance Dashboard 📈
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
              Monitor student performance and track quiz analytics
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ 
            mb: 4, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)', 
            borderRadius: 5,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ 
                mb: 3, 
                color: '#333', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                📚 Select Quiz to Analyze
              </Typography>
              <Grid container spacing={2}>
                {quizzes.map((quiz) => (
                  <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        fullWidth
                        variant={selectedQuiz?.id === quiz.id ? 'contained' : 'outlined'}
                        onClick={() => handleQuizSelect(quiz)}
                        sx={{
                          px: 3,
                          py: 2,
                          borderRadius: 3,
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          ...(selectedQuiz?.id === quiz.id ? {
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                            '&:hover': { 
                              background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                              boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                            }
                          } : {
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5a67d8',
                              background: 'rgba(102, 126, 234, 0.1)'
                            }
                          })
                        }}
                      >
                        {quiz.title}
                      </Button>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {selectedQuiz && (
          <>
            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {[
                  { 
                    label: 'Total Attempts', 
                    value: getStatsForQuiz(selectedQuiz.title).totalAttempts, 
                    icon: People,
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  },
                  { 
                    label: 'Average Score', 
                    value: `${getStatsForQuiz(selectedQuiz.title).avgScore}%`, 
                    icon: TrendingUp,
                    gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
                  },
                  { 
                    label: 'Pass Rate', 
                    value: `${getStatsForQuiz(selectedQuiz.title).passRate}%`, 
                    icon: EmojiEvents,
                    gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  }
                ].map((stat, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                      whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.95)', 
                        backdropFilter: 'blur(20px)', 
                        textAlign: 'center', 
                        borderRadius: 5, 
                        p: 3, 
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: stat.gradient
                        }
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
                          <Typography sx={{ color: '#666', fontWeight: 500, fontSize: '1.1rem' }}>
                            {stat.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Results Table */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: 5,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h5" sx={{ 
                      color: '#333', 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      📋 Detailed Results: {selectedQuiz.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* Filter Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {[
                          { key: 'all', label: 'All', color: '#667eea' },
                          { key: 'excellent', label: 'Excellent (90%+)', color: '#4CAF50' },
                          { key: 'good', label: 'Good (70-89%)', color: '#2196F3' },
                          { key: 'average', label: 'Average (50-69%)', color: '#FF9800' },
                          { key: 'poor', label: 'Poor (<50%)', color: '#f44336' }
                        ].map((filter) => (
                          <Button
                            key={filter.key}
                            size="small"
                            variant={activeFilter === filter.key ? 'contained' : 'outlined'}
                            onClick={() => handleFilter(filter.key)}
                            sx={{
                              borderRadius: 3,
                              px: 2,
                              py: 0.5,
                              fontSize: '0.8rem',
                              textTransform: 'none',
                              ...(activeFilter === filter.key ? {
                                background: filter.color,
                                color: 'white',
                                '&:hover': { background: filter.color }
                              } : {
                                borderColor: filter.color,
                                color: filter.color,
                                '&:hover': {
                                  borderColor: filter.color,
                                  background: `${filter.color}10`
                                }
                              })
                            }}
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </Box>
                      
                      {/* Export Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PictureAsPdf />}
                          onClick={exportToPDF}
                          sx={{
                            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                            borderRadius: 3,
                            px: 2,
                            py: 0.5,
                            fontSize: '0.8rem',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #d32f2f, #c62828)'
                            }
                          }}
                        >
                          PDF
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<TableChart />}
                          onClick={exportToExcel}
                          sx={{
                            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                            borderRadius: 3,
                            px: 2,
                            py: 0.5,
                            fontSize: '0.8rem',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #45a049, #388e3c)'
                            }
                          }}
                        >
                          Excel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                
                  {loading ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" sx={{ color: '#666' }}>Loading results...</Typography>
                    </Box>
                  ) : filteredResults.length > 0 ? (
                    <TableContainer sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            '& .MuiTableCell-head': {
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem'
                            }
                          }}>
                            <TableCell>👤 Student Name</TableCell>
                            <TableCell>📧 Email</TableCell>
                            <TableCell align="center">📊 Score</TableCell>
                            <TableCell align="center">🎯 Grade</TableCell>
                            <TableCell align="center">📅 Completed</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredResults.map((result, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              component={TableRow}
                              sx={{ 
                                '&:nth-of-type(odd)': { backgroundColor: 'rgba(102, 126, 234, 0.05)' },
                                '&:hover': { 
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>{result.name}</TableCell>
                              <TableCell sx={{ color: '#666' }}>{result.email}</TableCell>
                              <TableCell align="center">
                                <Typography sx={{ fontWeight: 600 }}>
                                  {result.score}/{result.total_questions}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${result.percentage}%`}
                                  sx={{
                                    background: result.percentage >= 80 ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 
                                               result.percentage >= 60 ? 'linear-gradient(135deg, #FF9800, #F57C00)' : 
                                               'linear-gradient(135deg, #f44336, #d32f2f)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ color: '#666' }}>
                                {new Date(result.completed_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                      borderRadius: 3,
                      border: '2px dashed #667eea'
                    }}>
                      <EmojiEvents sx={{ fontSize: 60, color: '#667eea', mb: 2, opacity: 0.7 }} />
                      <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                        {activeFilter === 'all' ? 'No Results Available' : `No ${activeFilter} results found`}
                      </Typography>
                      <Typography sx={{ color: '#999' }}>
                        {activeFilter === 'all' ? 'No students have taken this quiz yet' : 'Try adjusting the filter criteria'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </Box>
    </Box>
  );
};

export default QuizResults;