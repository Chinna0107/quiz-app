import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, Radio, RadioGroup, FormControlLabel, LinearProgress, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchQuiz();
    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [quizId]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please stay in fullscreen mode during the quiz!' });
      enterFullscreen();
    }
  };

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/api/users/quiz/${quizId}`);
      setQuiz(response.data);
      if (response.data?.timer) setTimeLeft(response.data.timer * 60);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load quiz' });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const normalizedAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) =>
          quiz.questions[k]?.type === 'fill'
            ? [k, typeof v === 'string' ? v.trim().toLowerCase() : v]
            : [k, v]
        )
      );
      const response = await api.post(`/api/users/quiz/${quizId}/submit`, { 
        answers: normalizedAnswers, 
        userId: user?.id 
      });
      
      const { score, totalQuestions, percentage } = response.data;
      
      if (document.fullscreenElement) document.exitFullscreen();
      
      Swal.fire({
        icon: 'success',
        title: '🎉 Quiz Completed!',
        html: `
          <div style="font-size: 18px;">
            <p><strong>Score: ${score}/${totalQuestions}</strong></p>
            <p><strong>Percentage: ${percentage}%</strong></p>
          </div>`,
        confirmButtonText: 'Continue'
      });
      
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit quiz' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Typography>Loading...</Typography></Box>;

  if (!quiz) return null;

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: 4, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
              {quiz.title}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Typography>
                {timeLeft !== null && (
                  <Box sx={{
                    px: 2, py: 0.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem',
                    background: timeLeft < 60 ? 'rgba(255,0,0,0.1)' : 'rgba(102,126,234,0.1)',
                    color: timeLeft < 60 ? '#d32f2f' : '#667eea',
                    border: `2px solid ${timeLeft < 60 ? '#d32f2f' : '#667eea'}`,
                    animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } }
                  }}>
                    ⏱ {formatTime(timeLeft)}
                  </Box>
                )}
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>

            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#333' }}>
                {question.question_text}
              </Typography>

              {question.type === 'fill' ? (
                <TextField
                  fullWidth
                  label="Your Answer"
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              ) : (
                <RadioGroup value={answers[currentQuestion] ?? ''} onChange={(e) => handleAnswerChange(parseInt(e.target.value))}>
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={option.option_text}
                      sx={{ mb: 1, '& .MuiFormControlLabel-label': { fontSize: '1.1rem' } }}
                    />
                  ))}
                </RadioGroup>
              )}
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                sx={{ px: 3, py: 1.5, borderRadius: 2 }}
              >
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quiz.questions.length || submitting}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': { background: 'linear-gradient(45deg, #5a6fd8, #6a4190)' }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': { background: 'linear-gradient(45deg, #5a6fd8, #6a4190)' }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TakeQuiz;