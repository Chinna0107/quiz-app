import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, TextField, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: question count, 2: quiz form
  const [questionCount, setQuestionCount] = useState(25);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: []
  });
  const [loading, setLoading] = useState(false);

  const initializeQuestions = (count) => {
    const questions = Array(count).fill().map(() => ({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }));
    setQuizData({ ...quizData, questions });
    setStep(2);
  };

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index].question = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value);
    setQuizData({ ...quizData, questions: newQuestions });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting quiz data:', quizData);
    try {
      const response = await api.post('/api/admin/create-quiz', quizData);
      console.log('Quiz created successfully:', response.data);
      Swal.fire({ icon: 'success', title: 'Quiz Created!', timer: 2000, showConfirmButton: false });
      navigate('/admin');
    } catch (error) {
      console.error('Quiz creation error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to create quiz';
      Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
              Create New Quiz
            </Typography>
            
            {step === 1 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>How many questions?</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[1,5,10,25, 30, 40, 50].map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? 'contained' : 'outlined'}
                      onClick={() => setQuestionCount(count)}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        ...(questionCount === count && {
                          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                          '&:hover': { background: 'linear-gradient(45deg, #ff5252, #d84315)' }
                        })
                      }}
                    >
                      {count} Questions
                    </Button>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  onClick={() => initializeQuestions(questionCount)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    '&:hover': { background: 'linear-gradient(45deg, #ff5252, #d84315)' }
                  }}
                >
                  Start Creating Quiz
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin')}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                name="title"
                label="Quiz Title"
                value={quizData.title}
                onChange={handleQuizChange}
                required
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                name="description"
                label="Quiz Description"
                value={quizData.description}
                onChange={handleQuizChange}
                multiline
                rows={3}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {quizData.questions.map((q, qIndex) => (
                <motion.div key={qIndex} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: qIndex * 0.1 }}>
                  <Paper sx={{ p: 2, mb: 2, background: 'rgba(255, 107, 107, 0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Question {qIndex + 1} of {quizData.questions.length}</Typography>
                    </Box>
                    
                    <TextField
                      label="Question"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      required
                      fullWidth
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    {q.options.map((option, oIndex) => (
                      <TextField
                        key={oIndex}
                        label={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    ))}

                    <TextField
                      select
                      label="Correct Answer"
                      value={q.correctAnswer}
                      onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                      SelectProps={{ native: true }}
                      sx={{ mt: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {q.options.map((_, oIndex) => (
                        <option key={oIndex} value={oIndex}>Option {oIndex + 1}</option>
                      ))}
                    </TextField>
                  </Paper>
                </motion.div>
              ))}



              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    '&:hover': { background: 'linear-gradient(45deg, #ff5252, #d84315)' }
                  }}
                >
                  {loading ? 'Creating...' : 'Create Quiz'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin')}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateQuiz;