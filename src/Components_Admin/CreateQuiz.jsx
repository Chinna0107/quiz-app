import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, TextField, Chip, InputAdornment } from '@mui/material';
import { Edit, Timer, Quiz, Description, CheckCircle, ArrowForward, ArrowBack, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const glass = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 4,
};

const glassCard = {
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 3,
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.7)' },
};

const Orb = ({ style }) => (
  <motion.div
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }}
    transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute', borderRadius: '50%',
      filter: 'blur(60px)', opacity: 0.35, pointerEvents: 'none', ...style
    }}
  />
);

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [questionCount, setQuestionCount] = useState(25);
  const [quizData, setQuizData] = useState({ title: '', description: '', timer: '', questions: [] });
  const [loading, setLoading] = useState(false);
  const [previousQuizzes, setPreviousQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/quizzes')
      .then(res => setPreviousQuizzes(res.data || []))
      .catch(() => {})
      .finally(() => setQuizzesLoading(false));
  }, []);

  const initializeQuestions = () => {
    const questions = Array(questionCount).fill(null).map(() => ({
      question: '', options: ['', '', '', ''], correctAnswer: 0
    }));
    setQuizData(d => ({ ...d, questions }));
    setStep(2);
  };

  const handleQuizChange = (e) => setQuizData(d => ({ ...d, [e.target.name]: e.target.value }));
  const handleQuestionChange = (i, v) => setQuizData(d => { const q = [...d.questions]; q[i].question = v; return { ...d, questions: q }; });
  const handleOptionChange = (qi, oi, v) => setQuizData(d => { const q = [...d.questions]; q[qi].options[oi] = v; return { ...d, questions: q }; });
  const handleCorrectAnswerChange = (qi, v) => setQuizData(d => { const q = [...d.questions]; q[qi].correctAnswer = parseInt(v); return { ...d, questions: q }; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/admin/create-quiz', quizData);
      Swal.fire({ icon: 'success', title: 'Quiz Created!', timer: 2000, showConfirmButton: false });
      navigate('/admin');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'Failed to create quiz' });
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)',
      py: { xs: 3, md: 5 }, position: 'relative', overflow: 'hidden'
    }}>
      {/* Animated orbs */}
      <Orb style={{ width: 400, height: 400, background: '#ff6b6b', top: '-10%', left: '-10%' }} />
      <Orb style={{ width: 350, height: 350, background: '#764ba2', top: '30%', right: '-8%' }} />
      <Orb style={{ width: 300, height: 300, background: '#ee5a24', bottom: '-5%', left: '30%' }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 70, height: 70, borderRadius: '50%', mb: 2,
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
              boxShadow: '0 8px 32px rgba(255,107,107,0.4)'
            }}>
              <Add sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.3)', letterSpacing: '-0.5px' }}>
              Create New Quiz
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              {step === 1 ? 'Set up your quiz parameters' : `Filling ${quizData.questions.length} questions`}
            </Typography>
          </Box>
        </motion.div>

        {/* Step indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
            {['Setup', 'Questions'].map((label, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'rgba(255,255,255,0.15)',
                  border: step === i + 1 ? '2px solid #ff6b6b' : '2px solid transparent',
                  color: 'white', fontWeight: 'bold', fontSize: 14, transition: 'all 0.3s'
                }}>
                  {step > i + 1 ? <CheckCircle sx={{ fontSize: 18 }} /> : i + 1}
                </Box>
                <Typography sx={{ color: step === i + 1 ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: step === i + 1 ? 700 : 400, fontSize: 14 }}>
                  {label}
                </Typography>
                {i === 0 && <Box sx={{ width: 40, height: 2, background: step > 1 ? 'linear-gradient(90deg,#ff6b6b,#ee5a24)' : 'rgba(255,255,255,0.2)', borderRadius: 1 }} />}
              </Box>
            ))}
          </Box>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4 }}>
              <Box sx={{ ...glass, p: { xs: 3, md: 5 } }}>
                {/* Question count */}
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 18, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Quiz sx={{ color: '#ff6b6b' }} /> Number of Questions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                  {[1, 5, 10, 25, 30, 40, 50].map((count) => (
                    <motion.div key={count} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setQuestionCount(count)}
                        sx={{
                          px: 2.5, py: 1.2, borderRadius: 2, fontWeight: 700, fontSize: 15,
                          minWidth: 70,
                          background: questionCount === count
                            ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                            : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: questionCount === count ? 'none' : '1px solid rgba(255,255,255,0.2)',
                          boxShadow: questionCount === count ? '0 4px 20px rgba(255,107,107,0.5)' : 'none',
                          '&:hover': {
                            background: questionCount === count
                              ? 'linear-gradient(135deg, #ff5252, #d84315)'
                              : 'rgba(255,255,255,0.18)',
                          }
                        }}
                      >
                        {count}
                      </Button>
                    </motion.div>
                  ))}
                </Box>

                {/* Timer */}
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 18, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timer sx={{ color: '#ff6b6b' }} /> Quiz Timer
                </Typography>
                <TextField
                  name="timer"
                  label="Duration (minutes)"
                  type="number"
                  value={quizData.timer}
                  onChange={handleQuizChange}
                  inputProps={{ min: 1, max: 300 }}
                  sx={{ ...fieldSx, width: 240, mb: 4 }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Timer sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment> }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="contained"
                      onClick={initializeQuestions}
                      endIcon={<ArrowForward />}
                      sx={{
                        px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 16,
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.4)',
                        '&:hover': { background: 'linear-gradient(135deg, #ff5252, #d84315)', boxShadow: '0 12px 35px rgba(255,107,107,0.5)' }
                      }}
                    >
                      Start Creating
                    </Button>
                  </motion.div>
                  <Button
                    onClick={() => navigate('/admin')}
                    sx={{ px: 4, py: 1.5, borderRadius: 2, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.08)', color: 'white' } }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Quiz info card */}
                <Box sx={{ ...glass, p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 18, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description sx={{ color: '#ff6b6b' }} /> Quiz Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField name="title" label="Quiz Title" value={quizData.title} onChange={handleQuizChange} required fullWidth sx={fieldSx} />
                    <TextField name="description" label="Quiz Description" value={quizData.description} onChange={handleQuizChange} multiline rows={3} fullWidth sx={fieldSx} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)' }}>
                      <Timer sx={{ color: '#ff6b6b' }} />
                      <Typography sx={{ color: 'white', fontWeight: 600 }}>
                        Timer: {quizData.timer ? `${quizData.timer} minutes` : 'No timer set'}
                      </Typography>
                      <Chip label={`${quizData.questions.length} Questions`} size="small" sx={{ ml: 'auto', background: 'rgba(255,107,107,0.3)', color: 'white', fontWeight: 700 }} />
                    </Box>
                  </Box>
                </Box>

                {/* Questions */}
                {quizData.questions.map((q, qIndex) => (
                  <motion.div key={qIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(qIndex * 0.05, 0.5) }}>
                    <Box sx={{ ...glassCard, p: { xs: 2.5, md: 3 }, position: 'relative', overflow: 'hidden' }}>
                      {/* accent bar */}
                      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg, #ff6b6b, #ee5a24)', borderRadius: '3px 0 0 3px' }} />
                      <Box sx={{ pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', fontWeight: 800, fontSize: 13
                          }}>
                            {qIndex + 1}
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
                            Question {qIndex + 1} <Typography component="span" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>of {quizData.questions.length}</Typography>
                          </Typography>
                        </Box>

                        <TextField
                          label="Question Text"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                          required fullWidth
                          sx={{ ...fieldSx, mb: 2.5 }}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                          {q.options.map((option, oIndex) => (
                            <TextField
                              key={oIndex}
                              label={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              required
                              sx={{
                                ...fieldSx,
                                '& .MuiOutlinedInput-root': {
                                  ...fieldSx['& .MuiOutlinedInput-root'],
                                  ...(q.correctAnswer === oIndex && {
                                    '& fieldset': { borderColor: '#4caf50 !important', borderWidth: '2px' },
                                    background: 'rgba(76,175,80,0.12)',
                                  })
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Box sx={{
                                      width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      background: q.correctAnswer === oIndex ? '#4caf50' : 'rgba(255,255,255,0.15)',
                                      fontSize: 11, color: 'white', fontWeight: 700
                                    }}>
                                      {String.fromCharCode(65 + oIndex)}
                                    </Box>
                                  </InputAdornment>
                                )
                              }}
                            />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Correct Answer:</Typography>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                            style={{
                              background: 'rgba(76,175,80,0.15)',
                              border: '1px solid rgba(76,175,80,0.5)',
                              borderRadius: 8,
                              color: 'white',
                              padding: '8px 12px',
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              outline: 'none',
                              minWidth: 200,
                            }}
                          >
                            {q.options.map((opt, oIndex) => (
                              <option key={oIndex} value={oIndex} style={{ background: '#2d1b4e', color: 'white' }}>
                                {String.fromCharCode(65 + oIndex)}: {opt || `Option ${oIndex + 1}`}
                              </option>
                            ))}
                          </select>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pt: 1 }}>
                  <Button
                    onClick={() => setStep(1)}
                    startIcon={<ArrowBack />}
                    sx={{ px: 3, py: 1.5, borderRadius: 2, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.08)', color: 'white' } }}
                  >
                    Back
                  </Button>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        px: 5, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 16,
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.4)',
                        '&:hover': { background: 'linear-gradient(135deg, #ff5252, #d84315)' },
                        '&:disabled': { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }
                      }}
                    >
                      {loading ? 'Creating...' : '🚀 Create Quiz'}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Quizzes */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Box sx={{ ...glass, p: { xs: 3, md: 4 }, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 28, borderRadius: 2, background: 'linear-gradient(180deg, #ff6b6b, #ee5a24)' }} />
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 20 }}>Previous Quizzes</Typography>
              {!quizzesLoading && (
                <Chip label={previousQuizzes.length} size="small" sx={{ ml: 'auto', background: 'rgba(255,107,107,0.3)', color: 'white', fontWeight: 700 }} />
              )}
            </Box>

            {quizzesLoading ? (
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                {[1, 2, 3].map(i => (
                  <Box key={i} sx={{ height: 64, borderRadius: 2, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
                ))}
              </Box>
            ) : previousQuizzes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Quiz sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No quizzes created yet</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {previousQuizzes.map((quiz, i) => (
                  <motion.div key={quiz.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ x: 4 }}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      p: 2, borderRadius: 2,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      transition: 'all 0.2s',
                      '&:hover': { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,107,107,0.4)' }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(238,90,36,0.3))',
                          border: '1px solid rgba(255,107,107,0.3)'
                        }}>
                          <Quiz sx={{ color: '#ff6b6b', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{quiz.title}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip label={`${quiz.questions?.length ?? 0} Qs`} size="small" sx={{ height: 20, fontSize: 11, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }} />
                            {quiz.timer && (
                              <Chip
                                icon={<Timer sx={{ fontSize: '12px !important', color: '#ffb74d !important' }} />}
                                label={`${quiz.timer} min`}
                                size="small"
                                sx={{ height: 20, fontSize: 11, background: 'rgba(255,183,77,0.2)', color: '#ffb74d' }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          startIcon={<Edit sx={{ fontSize: 16 }} />}
                          onClick={() => navigate(`/admin/edit-quiz/${quiz.id}`)}
                          sx={{
                            px: 2.5, py: 1, borderRadius: 2, fontWeight: 600, fontSize: 13,
                            background: 'rgba(255,107,107,0.2)',
                            color: '#ff8a80',
                            border: '1px solid rgba(255,107,107,0.3)',
                            '&:hover': { background: 'rgba(255,107,107,0.35)', color: 'white', border: '1px solid rgba(255,107,107,0.6)' }
                          }}
                        >
                          Edit
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateQuiz;
