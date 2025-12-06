import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../config/api';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: details
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/send-otp', { email });
      Swal.fire({ icon: 'success', title: 'OTP Sent!', text: 'Check your email for verification code', timer: 2000, showConfirmButton: false });
      setStep(2);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'Failed to send OTP' });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/verify-otp', { email, otp });
      Swal.fire({ icon: 'success', title: 'OTP Verified!', timer: 1500, showConfirmButton: false });
      setStep(3);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Invalid OTP', text: error.response?.data?.error || 'Please try again' });
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match' });
      return;
    }
    try {
      await api.post('/api/users/create-account', { email, name: formData.name, phone_number: formData.phone_number, password: formData.password, confirmPassword: formData.confirmPassword });
      Swal.fire({ icon: 'success', title: 'Account Created!', text: 'You can now login', timer: 2000, showConfirmButton: false });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Account Creation Failed', text: error.response?.data?.error || 'Please try again' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ 
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <Paper sx={{ 
        p: 4, 
        width: 450, 
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }} elevation={0}>
        {step === 1 && (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#333', fontWeight: 'bold' }}>Create Account</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Enter your email to get started</Typography>
            <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)' } }}>Send OTP</Button>
              <Button variant="text" onClick={() => navigate('/')} sx={{ color: '#667eea', textTransform: 'none', mt: 1 }}>Already have an account? Sign In</Button>
            </Box>
          </>
        )}
        
        {step === 2 && (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#333', fontWeight: 'bold' }}>Verify Email</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Enter the OTP sent to {email}</Typography>
            <Box component="form" onSubmit={handleOtpSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)' } }}>Verify OTP</Button>
              <Button variant="text" onClick={() => setStep(1)} sx={{ color: '#667eea', textTransform: 'none', mt: 1 }}>Back to Email</Button>
            </Box>
          </>
        )}
        
        {step === 3 && (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#333', fontWeight: 'bold' }}>Complete Profile</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Fill in your details</Typography>
            <Box component="form" onSubmit={handleDetailsSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField name="name" label="Full Name" value={formData.name} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <TextField name="phone_number" label="Phone Number" value={formData.phone_number} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <TextField name="password" type="password" label="Password" value={formData.password} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <TextField name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)' } }}>Create Account</Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SignUp;