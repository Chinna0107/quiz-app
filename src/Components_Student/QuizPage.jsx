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

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

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
    try {
      const response = await api.post(`/api/users/quiz/${quizId}/submit`, { 
        answers, userId: user?.id 
      });

      const { score, totalQuestions, percentage } = response.data;

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
            <Typography variant="h4" sx={{ 
              mb: 4, 
              color: '#333', 
              fontWeight: 600,
              lineHeight: 1.4
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
                    label={option.option_text}
                    sx={{ 
                      m: 0,
                      p: 2,
                      borderRadius: 3,
                      border: '2px solid transparent',
                      background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                        border: '2px solid rgba(102, 126, 234, 0.3)'
                      },
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        color: '#333',
                        flex: 1
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
            disabled={Object.keys(answers).length !== currentQuiz.questions.length}
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
            🎯 Submit Quiz
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