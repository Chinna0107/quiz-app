import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';
import api from '../config/api';
import Swal from 'sweetalert2';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    branch: '',
    rollNo: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/users/create-account', {
        name: formData.name,
        email: formData.email,
        phone_number: formData.mobile,
        year: formData.year,
        branch: formData.branch,
        roll_no: formData.rollNo,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      Swal.fire({ icon: 'success', title: 'Account Created!', text: 'You can now login', timer: 2000, showConfirmButton: false });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Account Creation Failed', text: error.response?.data?.error || 'Please try again' });
    } finally {
      setLoading(false);
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
        width: 500, 
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }} elevation={0}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, color: '#333', fontWeight: 'bold' }}>Create Account</Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>Fill in your details to get started</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField name="name" label="Full Name" value={formData.name} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField name="email" type="email" label="Email" value={formData.email} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField name="year" select label="Year" value={formData.year} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </TextField>
          <TextField name="branch" select label="Branch" value={formData.branch} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
            <MenuItem value="AIDS">AIDS</MenuItem>
            <MenuItem value="AIML">AIML</MenuItem>
            <MenuItem value="DATA SCIENCE">DATA SCIENCE</MenuItem>
            <MenuItem value="EEE">EEE</MenuItem>
            <MenuItem value="CIVIL">CIVIL</MenuItem>
            <MenuItem value="MECH">MECH</MenuItem>
            <MenuItem value="M.TECH">M.TECH</MenuItem>
            <MenuItem value="MBA">MBA</MenuItem>
            <MenuItem value="MCA">MCA</MenuItem>
            <MenuItem value="OTHERS">OTHERS</MenuItem>
          </TextField>
          <TextField name="rollNo" label="Roll Number" value={formData.rollNo} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField name="mobile" label="Mobile Number" value={formData.mobile} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField name="password" type="password" label="Password" value={formData.password} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)' }, '&:disabled': { background: '#ccc' } }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <Button variant="text" onClick={() => navigate('/')} sx={{ color: '#667eea', textTransform: 'none' }}>Already have an account? Sign In</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;