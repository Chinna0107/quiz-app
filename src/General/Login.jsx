import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Container, Alert, Fade, Slide, CircularProgress } from '@mui/material';
import { Quiz } from '@mui/icons-material';
import api from '../config/api';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/users/login', formData);
      const { token, admintoken, user } = response.data;
      if (admintoken) {
        localStorage.setItem('adminToken', admintoken);
      } else {
        localStorage.setItem('token', token);
      }
      onLogin(user);
      Swal.fire({ icon: 'success', title: 'Login Successful!', timer: 1500, showConfirmButton: false });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Slide direction="down" in timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Quiz
                  sx={{
                    fontSize: 60,
                    color: '#667eea',
                    mb: 2,
                    animation: 'bounce 2s infinite',
                    '@keyframes bounce': {
                      '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                      '40%': { transform: 'translateY(-10px)' },
                      '60%': { transform: 'translateY(-5px)' },
                    },
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Sign in to your quiz account
                </Typography>
              </Box>
            </Slide>
            
            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}
            
            <Slide direction="up" in timeout={800}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    },
                    '&:disabled': { background: '#ccc' },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Signing in...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/forgot-password')}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Forgot Password?
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => navigate('/signup')}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </Slide>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;