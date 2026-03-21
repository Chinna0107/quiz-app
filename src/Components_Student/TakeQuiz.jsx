import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Radio, RadioGroup, LinearProgress, TextField, Chip } from '@mui/material';
import { Timer, ArrowBack, ArrowForward, CheckCircle, Send } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const timerStage = (secs, total) => {
  const pct = total > 0 ? secs / total : 1;
  if (pct > 0.5) return { color: '#4caf50', bg: 'rgba(76,175,80,0.18)', border: '#4caf50', glow: 'rgba(76,175,80,0.5)' };
  if (pct > 0.25) return { color: '#FF9800', bg: 'rgba(255,152,0,0.18)', border: '#FF9800', glow: 'rgba(255,152,0,0.5)' };
  return { color: '#f44336', bg: 'rgba(244,67,54,0.18)', border: '#f44336', glow: 'rgba(244,67,54,0.6)' };
};

const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const timedOutRef = useRef(false);

  useEffect(() => {
    fetchQuiz();

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser?.is_admin) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }

    const onFullscreen = () => {
      if (!document.fullscreenElement)
        Swal.fire({ icon: 'warning', title: 'Warning', text: 'Please stay in fullscreen!', confirmButtonText: 'Go Fullscreen', allowOutsideClick: false })
          .then(() => document.documentElement.requestFullscreen?.().catch(() => {}));
    };

    const onRightClick = (e) => e.preventDefault();

    const onVisibility = () => {
      if (document.hidden)
        Swal.fire({ icon: 'warning', title: '⚠️ Tab Switch Detected!', text: 'Switching tabs is not allowed during the quiz!', confirmButtonText: 'Back to Quiz', allowOutsideClick: false, allowEscapeKey: false });
    };

    const onBlur = () => {
      Swal.fire({ icon: 'warning', title: '⚠️ Focus Lost!', text: 'Please stay on the quiz window!', confirmButtonText: 'Back to Quiz', allowOutsideClick: false, allowEscapeKey: false });
    };

    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('contextmenu', onRightClick);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('contextmenu', onRightClick);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
    };
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/users/quiz/${quizId}`);
      setQuiz(res.data);
      if (res.data?.timer) {
        const secs = parseInt(res.data.timer) * 60;
        setTimeLeft(secs);
        setTotalTime(secs);
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load quiz' });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); timedOutRef.current = true; return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft === null]);

  // timeout handler — separate effect for fresh answers access
  useEffect(() => {
    if (timeLeft === 0 && timedOutRef.current) {
      timedOutRef.current = false;
      Swal.fire({
        icon: 'warning', title: '⏰ Time is Up!',
        text: 'Your time has ended. Please submit your quiz now.',
        confirmButtonText: '🚀 Submit Now',
        allowOutsideClick: false, allowEscapeKey: false,
      }).then(() => handleSubmit(true));
    }
  }, [timeLeft]);

  const handleAnswerChange = (value) => {
    const updated = { ...answersRef.current, [currentQuestion]: value };
    answersRef.current = updated;
    setAnswers(updated);
  };

  const handleSubmit = async (isAuto = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const cur = answersRef.current;
      const normalizedAnswers = Object.fromEntries(
        Object.entries(cur).map(([k, v]) =>
          quiz.questions[k]?.type === 'fill'
            ? [k, typeof v === 'string' ? v.trim().toLowerCase() : v]
            : [k, v]
        )
      );
      const res = await api.post(`/api/users/quiz/${quizId}/submit`, {
        answers: normalizedAnswers,
        userId: storedUser?.id,
      });
      const { score, totalQuestions, percentage } = res.data;
      if (document.fullscreenElement) document.exitFullscreen();
      Swal.fire({
        icon: 'success', title: '🎉 Quiz Completed!',
        html: `<div style="font-size:18px"><p><strong>Score: ${score} / ${totalQuestions}</strong></p><p><strong>Percentage: ${percentage}%</strong></p></div>`,
        confirmButtonText: 'Continue',
      }).then(() => navigate('/dashboard'));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.error || 'Failed to submit quiz' });
      submittingRef.current = false;
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
          <Timer sx={{ fontSize: 48, color: '#667eea' }} />
        </motion.div>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 2 }}>Loading quiz...</Typography>
      </Box>
    </Box>
  );

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const questionText = (question?.question_text ?? question?.question ?? '').replace(/\\n/g, '\n');
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const stage = timeLeft !== null && totalTime ? timerStage(timeLeft, totalTime) : null;
  const timerPct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
  const isCritical = timeLeft !== null && timeLeft < 60;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', userSelect: 'none' }}>
      {/* orbs */}
      <Box sx={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: '#667eea', filter: 'blur(80px)', opacity: 0.12, top: '-10%', left: '-10%', pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', width: 350, height: 350, borderRadius: '50%', background: '#764ba2', filter: 'blur(80px)', opacity: 0.12, bottom: '-10%', right: '-8%', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,12,41,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', px: { xs: 2, md: 4 }, py: 1.2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 900, mx: 'auto' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 14, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {quiz.title}
          </Typography>
          <Chip label={`Q ${currentQuestion + 1} / ${quiz.questions.length}`} size="small"
            sx={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', fontWeight: 700, fontSize: 11 }} />

          {/* TIMER */}
          {stage && (
            <motion.div animate={isCritical ? { scale: [1, 1.07, 1] } : { scale: 1 }} transition={{ duration: 0.6, repeat: isCritical ? Infinity : 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, px: 2, py: 0.8, borderRadius: 2, background: stage.bg, border: `2px solid ${stage.border}`, boxShadow: `0 0 20px ${stage.glow}`, minWidth: 110 }}>
                <motion.div animate={isCritical ? { rotate: [-15, 15, -15] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
                  <Timer sx={{ color: stage.color, fontSize: 20 }} />
                </motion.div>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', lineHeight: 1 }}>Time Left</Typography>
                  <Typography sx={{ color: stage.color, fontWeight: 900, fontSize: 22, fontFamily: 'monospace', letterSpacing: 2, lineHeight: 1.1, textShadow: `0 0 12px ${stage.glow}` }}>
                    {fmt(timeLeft)}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>

        {/* timer drain bar */}
        {stage && (
          <LinearProgress variant="determinate" value={timerPct}
            sx={{ mt: 0.8, height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg,${stage.color},${stage.color}88)`, borderRadius: 2, transition: 'width 1s linear' } }} />
        )}
      </Box>

      <Container maxWidth="md" sx={{ pt: 3, pb: 4, position: 'relative', zIndex: 1 }}>
        {/* progress */}
        <Box sx={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, px: 3, py: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Progress</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{answeredCount} / {quiz.questions.length} answered</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#667eea,#764ba2)', borderRadius: 3 } }} />
        </Box>

        {/* question card */}
        <Box sx={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 14 }}>{currentQuestion + 1}</Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              Question {currentQuestion + 1} of {quiz.questions.length}
              {answers[currentQuestion] !== undefined && <Box component="span" sx={{ ml: 1.5, color: '#4caf50', fontWeight: 700 }}>✓ Answered</Box>}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <Typography sx={{ color: 'white', fontSize: { xs: 14, md: 15 }, fontWeight: 600, lineHeight: 1.7, mb: 3, whiteSpace: 'pre-wrap' }}>
                  {questionText || '\u00A0'}
                </Typography>

                {question.type === 'fill' ? (
                  <TextField fullWidth label="Your Answer" value={answers[currentQuestion] || ''} onChange={(e) => handleAnswerChange(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.08)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' } }} />
                ) : (
                  <RadioGroup value={answers[currentQuestion] ?? ''}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                      {question.options.map((option, i) => {
                        const optText = (option?.option_text ?? option ?? '').replace(/\\n/g, '\n');
                        const isSelected = answers[currentQuestion] === i;
                        return (
                          <motion.div key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                            <Box onClick={() => handleAnswerChange(i)} sx={{
                              display: 'flex', alignItems: 'center', gap: 1.8, p: { xs: 1.5, md: 1.8 }, borderRadius: 2, cursor: 'pointer',
                              background: isSelected ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.04)',
                              border: isSelected ? '2px solid #667eea' : '1px solid rgba(255,255,255,0.09)',
                              transition: 'all 0.18s',
                              '&:hover': { background: isSelected ? 'rgba(102,126,234,0.25)' : 'rgba(255,255,255,0.09)' },
                            }}>
                              <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isSelected ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'rgba(255,255,255,0.09)', border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.18)', transition: 'all 0.18s' }}>
                                {isSelected ? <CheckCircle sx={{ color: 'white', fontSize: 16 }} /> : <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: 11 }}>{String.fromCharCode(65 + i)}</Typography>}
                              </Box>
                              <Radio value={i} sx={{ display: 'none' }} />
                              <Typography sx={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.7)', fontSize: { xs: 13, md: 14 }, fontWeight: isSelected ? 600 : 400, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                {optText}
                              </Typography>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>
                  </RadioGroup>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => setCurrentQuestion(q => q - 1)} disabled={currentQuestion === 0} startIcon={<ArrowBack />}
              sx={{ px: 2.5, py: 1.2, borderRadius: 2, fontSize: 13, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', '&:hover': { background: 'rgba(255,255,255,0.07)', color: 'white' }, '&:disabled': { color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.06)' } }}>
              Previous
            </Button>
          </motion.div>

          {/* dot indicators */}
          <Box sx={{ display: 'flex', gap: 0.7, flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
            {quiz.questions.map((_, i) => (
              <Box key={i} onClick={() => setCurrentQuestion(i)} sx={{
                width: i === currentQuestion ? 20 : 9, height: 9, borderRadius: 5, cursor: 'pointer', transition: 'all 0.22s',
                background: i === currentQuestion ? '#667eea' : answers[i] !== undefined ? '#4caf50' : 'rgba(255,255,255,0.18)',
                boxShadow: i === currentQuestion ? '0 0 8px rgba(102,126,234,0.8)' : 'none',
              }} />
            ))}
          </Box>

          {currentQuestion === quiz.questions.length - 1 ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="contained" onClick={() => handleSubmit(false)} disabled={submitting} startIcon={<Send />}
                sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, fontSize: 13, background: 'linear-gradient(135deg,#667eea,#764ba2)', boxShadow: '0 4px 16px rgba(102,126,234,0.4)', '&:hover': { background: 'linear-gradient(135deg,#5a67d8,#6b46c1)' }, '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } }}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="contained" onClick={() => setCurrentQuestion(q => q + 1)} endIcon={<ArrowForward />}
                sx={{ px: 2.5, py: 1.2, borderRadius: 2, fontWeight: 700, fontSize: 13, background: 'linear-gradient(135deg,#667eea,#764ba2)', boxShadow: '0 4px 16px rgba(102,126,234,0.4)', '&:hover': { background: 'linear-gradient(135deg,#5a67d8,#6b46c1)' } }}>
                Next
              </Button>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default TakeQuiz;
