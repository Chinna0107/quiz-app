import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, TextField, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      Swal.fire({ icon: 'success', title: 'Message Sent!', text: 'We will get back to you soon.', timer: 2000, showConfirmButton: false });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
                Contact Us
              </Typography>
            </motion.div>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Send us a message</Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TextField name="name" label="Your Name" value={formData.name} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TextField name="email" type="email" label="Your Email" value={formData.email} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TextField name="subject" label="Subject" value={formData.subject} onChange={handleChange} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <TextField name="message" label="Message" value={formData.message} onChange={handleChange} required fullWidth multiline rows={4} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 1, py: 1.5, borderRadius: 2, background: 'linear-gradient(45deg, #667eea, #764ba2)', '&:hover': { background: 'linear-gradient(45deg, #5a6fd8, #6a4190)' } }}>
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#333', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Get in touch</Typography>
                  <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>We'd love to hear from you! Get in touch with us for any questions or support.</Typography>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Email:</Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>support@quizapp.com</Typography>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Phone:</Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>+91 12345 54321</Typography>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#333', fontSize: { xs: '1rem', sm: '1.25rem' } }}>Address:</Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#666', fontSize: { xs: '0.9rem', sm: '1rem' } }}>Annamacharya Institute Of Technology & Sciences - TIRUPATHI</Typography>
                  </motion.div>
                </motion.div>
              </Grid>
            </Grid>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ marginTop: '16px' }}>
              
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;