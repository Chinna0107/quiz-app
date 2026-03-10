import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Typography, Card, Button, Radio, RadioGroup, FormControlLabel, LinearProgress, CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const QuizPage = ({ user }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
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

  const loadQuiz = async () => {
    try {
      const response = await api.get(`/api/users/quiz/${quizId}`);
      setCurrentQuiz(response.data);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load quiz' });
      navigate('/dashboard');
    }
  };

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
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
      const response = await api.post(`/api/users/quiz/${quizId}/submit`, { 
        answers, userId: user?.id 
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

  const backToDashboard = () => {
    navigate('/dashboard');
  };

  if (!currentQuiz) {
    return null;
  }

  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
  const question = currentQuiz.questions[currentQuestion];

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={backToDashboard} 
          sx={{ 
            color: 'white',
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
        
        <Typography variant="h5" sx={{ 
          color: 'white', 
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          {currentQuiz.title}
        </Typography>
        
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          px: 3,
          py: 1
        }}>
          <Typography sx={{ color: 'white', fontWeight: 600 }}>
            {currentQuestion + 1} / {currentQuiz.questions.length}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #4CAF50, #45a049)',
              borderRadius: 4
            }
          }} 
        />
      </Box>

      {/* Question Content */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: { xs: 2, sm: 3 }
      }}>
        <motion.div 
          key={currentQuestion} 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: { xs: '100%', sm: '900px' } }}
        >
          <Card sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 5, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 2,
              borderBottom: '2px solid #667eea20'
            }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                {currentQuestion + 1}
              </Box>
              <Typography variant="body2" sx={{ 
                color: '#667eea', 
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Question {currentQuestion + 1} of {currentQuiz.questions.length}
              </Typography>
            </Box>
            
            <Typography variant="h4" sx={{ 
              mb: 4, 
              color: '#333', 
              fontWeight: 600,
              lineHeight: 1.4,
              fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2rem' }
            }}>
              {question.question_text}
            </Typography>

            <RadioGroup 
              value={answers[currentQuestion] !== undefined ? answers[currentQuestion] : ''} 
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ gap: 2 }}
            >
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FormControlLabel
                    value={index}
                    control={<Radio sx={{ '&.Mui-checked': { color: '#667eea' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box sx={{ 
                          minWidth: 35,
                          height: 35,
                          borderRadius: '50%',
                          background: answers[currentQuestion] === index ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e0e0e0',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}>
                          {String.fromCharCode(65 + index)}
                        </Box>
                        <Typography sx={{ flex: 1 }}>{option.option_text}</Typography>
                      </Box>
                    }
                    sx={{ 
                      m: 0,
                      p: 2,
                      borderRadius: 3,
                      border: answers[currentQuestion] === index ? '2px solid #667eea' : '2px solid transparent',
                      background: answers[currentQuestion] === index ? 'linear-gradient(135deg, #667eea15, #764ba215)' : 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        transform: 'translateX(5px)'
                      },
                      '& .MuiFormControlLabel-label': { 
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500,
                        color: '#333',
                        flex: 1,
                        width: '100%'
                      },
                      '& .Mui-checked + .MuiFormControlLabel-label': {
                        color: '#667eea',
                        fontWeight: 600
                      }
                    }}
                  />
                </motion.div>
              ))}
            </RadioGroup>
          </Card>
        </motion.div>
      </Box>

      {/* Navigation Footer */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        p: { xs: 2, sm: 3 },
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRadius: 3,
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              background: 'rgba(255, 255, 255, 0.1)'
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Previous
        </Button>

        {currentQuestion === currentQuiz.questions.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== currentQuiz.questions.length || submitting}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': { 
                background: 'linear-gradient(135deg, #45a049, #388e3c)',
                boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #9e9e9e, #757575)'
              }
            }}
          >
            {submitting ? 'Submitting...' : '🎯 Submit Quiz'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': { 
                background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Next →
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QuizPage;