import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Container, Button, TextField, CircularProgress, Chip, InputAdornment } from '@mui/material';
import { Timer, QuestionAnswer, Edit, ArrowBack, CheckCircle, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
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
  '& .MuiInputBase-input.Mui-disabled': { color: 'rgba(255,255,255,0.4)', WebkitTextFillColor: 'rgba(255,255,255,0.4)' },
};

const Orb = ({ style }) => (
  <motion.div
    animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.35, pointerEvents: 'none', ...style }}
  />
);

const EditQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchQuiz(); }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/users/quiz/${quizId}`);
      setQuizData(res.data);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load quiz' });
      navigate('/admin/create-quiz');
    } finally { setLoading(false); }
  };

  const handleQuizChange = (e) => setQuizData(d => ({ ...d, [e.target.name]: e.target.value }));

  const handleQuestionChange = (index, value) => {
    const questions = [...quizData.questions];
    questions[index].question_text = value;
    setQuizData({ ...quizData, questions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const questions = [...quizData.questions];
    questions[qIndex].options[oIndex].option_text = value;
    setQuizData({ ...quizData, questions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const questions = [...quizData.questions];
    questions[qIndex].correct_option = parseInt(value);
    setQuizData({ ...quizData, questions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/admin/quiz/${quizId}`, quizData);
      Swal.fire({ icon: 'success', title: 'Quiz Updated!', timer: 2000, showConfirmButton: false });
      navigate('/admin/create-quiz');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'Failed to update quiz' });
    } finally { setSaving(false); }
  };

  if (loading || !quizData) return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#ff6b6b' }} />
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0533 0%, #3d0c6e 40%, #6b1a1a 100%)',
      py: { xs: 3, md: 5 }, position: 'relative', overflow: 'hidden'
    }}>
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
              <Edit sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.3)', letterSpacing: '-0.5px' }}>
              Edit Quiz
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              Editing: <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{quizData.title}</strong>
            </Typography>
          </Box>
        </motion.div>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Quiz details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Box sx={{ ...glass, p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 4, height: 28, borderRadius: 2, background: 'linear-gradient(180deg, #ff6b6b, #ee5a24)' }} />
                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 18 }}>Quiz Details</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField name="title" label="Quiz Title" value={quizData.title || ''} onChange={handleQuizChange} required fullWidth sx={fieldSx} />
                <TextField name="description" label="Quiz Description" value={quizData.description || ''} onChange={handleQuizChange} multiline rows={3} fullWidth sx={fieldSx} />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Number of Questions"
                    value={quizData.questions?.length || 0}
                    disabled
                    sx={{ ...fieldSx, width: 220 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><QuestionAnswer sx={{ color: 'rgba(255,255,255,0.4)' }} /></InputAdornment> }}
                  />
                  <TextField
                    name="timer"
                    label="Timer (minutes)"
                    type="number"
                    value={quizData.timer || ''}
                    onChange={handleQuizChange}
                    inputProps={{ min: 1, max: 300 }}
                    sx={{ ...fieldSx, width: 220 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Timer sx={{ color: '#ff6b6b' }} /></InputAdornment> }}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Questions */}
          {quizData.questions?.map((q, qIndex) => (
            <motion.div key={qIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(qIndex * 0.05, 0.5) }}>
              <Box sx={{ ...glassCard, p: { xs: 2.5, md: 3 }, position: 'relative', overflow: 'hidden' }}>
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
                    value={q.question_text || ''}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    required fullWidth
                    sx={{ ...fieldSx, mb: 2.5 }}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                    {q.options?.map((option, oIndex) => (
                      <TextField
                        key={oIndex}
                        label={`Option ${oIndex + 1}`}
                        value={option.option_text || ''}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        sx={{
                          ...fieldSx,
                          '& .MuiOutlinedInput-root': {
                            ...fieldSx['& .MuiOutlinedInput-root'],
                            ...(q.correct_option === oIndex && {
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
                                background: q.correct_option === oIndex ? '#4caf50' : 'rgba(255,255,255,0.15)',
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Correct Answer:</Typography>
                    <select
                      value={q.correct_option ?? 0}
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
                        minWidth: 220,
                      }}
                    >
                      {q.options?.map((opt, oIndex) => (
                        <option key={oIndex} value={oIndex} style={{ background: '#2d1b4e', color: 'white' }}>
                          {String.fromCharCode(65 + oIndex)}: {opt.option_text || `Option ${oIndex + 1}`}
                        </option>
                      ))}
                    </select>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pb: 2 }}>
            <Button
              onClick={() => navigate('/admin/create-quiz')}
              startIcon={<ArrowBack />}
              sx={{ px: 3, py: 1.5, borderRadius: 2, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.08)', color: 'white' } }}
            >
              Back
            </Button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<Save />}
                sx={{
                  px: 5, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: 16,
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  boxShadow: '0 8px 25px rgba(255,107,107,0.4)',
                  '&:hover': { background: 'linear-gradient(135deg, #ff5252, #d84315)' },
                  '&:disabled': { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EditQuiz;
