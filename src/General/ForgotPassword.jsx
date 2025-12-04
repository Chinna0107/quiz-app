import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../config/api';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/reset-password', { email });
      Swal.fire({ icon: 'success', title: 'Reset OTP Sent!', text: 'Check your email for verification code', timer: 2000, showConfirmButton: false });
      setStep(2);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'Email not found' });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match' });
      return;
    }
    try {
      await api.post('/api/users/update-password', { email, otp, newPassword: passwords.password });
      Swal.fire({ icon: 'success', title: 'Password Reset!', text: 'You can now login with your new password', timer: 2000, showConfirmButton: false });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Reset Failed', text: error.response?.data?.error || 'Invalid OTP or expired' });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
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
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#333', fontWeight: 'bold' }}>Reset Password</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Enter your email to reset password</Typography>
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
              <Button variant="text" onClick={() => navigate('/')} sx={{ color: '#667eea', textTransform: 'none', mt: 1 }}>Back to Login</Button>
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
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#333', fontWeight: 'bold' }}>New Password</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Enter your new password</Typography>
            <Box component="form" onSubmit={handlePasswordReset} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField name="password" type="password" label="New Password" value={passwords.password} onChange={handlePasswordChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <TextField name="confirmPassword" type="password" label="Confirm Password" value={passwords.confirmPassword} onChange={handlePasswordChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }} />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)' } }}>Reset Password</Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;