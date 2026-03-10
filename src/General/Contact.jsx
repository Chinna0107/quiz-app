import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, TextField, Grid, Card, CardContent, Divider } from '@mui/material';
import { Email, Phone, LocationOn, Send, ContactMail, ArrowBack } from '@mui/icons-material';
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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, sm: 2 },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')} 
            sx={{ 
              mb: 3,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              px: 3,
              '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            Back to Home
          </Button> */}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            borderRadius: 5, 
            background: 'rgba(255, 255, 255, 0.98)', 
            backdropFilter: 'blur(30px)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <ContactMail sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                <Typography variant="h3" sx={{ 
                  mb: 2, 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  Get In Touch
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', fontWeight: 300, maxWidth: 600, mx: 'auto' }}>
                  We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={{ xs: 3, md: 5 }}>
              <Grid item xs={12} md={7} order={{ xs: 1, md: 1 }}>
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ 
                        mb: 3, 
                        color: '#333', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Send sx={{ color: '#667eea' }} />
                        Send Message
                      </Typography>
                      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                          <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={loading}
                            startIcon={<Send />}
                            sx={{ 
                              mt: 2, 
                              py: 1.5, 
                              px: 4,
                              borderRadius: 3, 
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              '&:hover': { 
                                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                              }
                            }}
                          >
                            {loading ? 'Sending...' : 'Send Message'}
                          </Button>
                        </motion.div>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={5} order={{ xs: 2, md: 2 }}>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                  <Typography variant="h5" sx={{ 
                    mb: 4, 
                    color: '#333', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Contact Information
                  </Typography>
                  
                  {[
                    { icon: Email, title: 'Email', info: 'codeathon2k26@gmail.com', color: '#FF6B6B' },
                    { icon: Phone, title: 'Phone', info: '+91 81798 60935', color: '#4ECDC4' },
                    { icon: LocationOn, title: 'Address', info: 'Annamacharya Institute Of Technology & Sciences - TIRUPATHI', color: '#45B7D1' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <Card sx={{ 
                        mb: 3, 
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        border: `2px solid ${item.color}20`,
                        '&:hover': {
                          boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                          borderColor: `${item.color}40`
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box sx={{ 
                              background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                              borderRadius: '50%',
                              p: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 50,
                              height: 50
                            }}>
                              <item.icon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 'bold', 
                                color: '#333',
                                mb: 0.5
                              }}>
                                {item.title}
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                color: '#666',
                                lineHeight: 1.5
                              }}>
                                {item.info}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </Grid>
            </Grid>

          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;