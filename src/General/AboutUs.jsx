import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, Grid, Card, CardContent } from '@mui/material';
import { ArrowBack, School, EmojiEvents, People, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const navigate = useNavigate();

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
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)} 
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
            Back
          </Button>
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
                <School sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                <Typography variant="h3" sx={{ 
                  mb: 2, 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  About Us
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', fontWeight: 300, maxWidth: 700, mx: 'auto' }}>
                  Empowering education through interactive assessments and innovative learning solutions
                </Typography>
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              <Typography variant="body1" sx={{ mb: 4, color: '#555', fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'justify' }}>
                Welcome to our Quiz Management System, a comprehensive platform designed to revolutionize the way educational assessments are conducted. 
                We believe in making learning engaging, accessible, and effective for everyone. Our platform provides educators with powerful tools to 
                create, manage, and analyze quizzes, while offering students an intuitive and interactive learning experience.
              </Typography>

              <Typography variant="body1" sx={{ mb: 5, color: '#555', fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'justify' }}>
                Built with cutting-edge technology and a user-centric approach, our system streamlines the assessment process, provides real-time 
                analytics, and helps track progress effectively. Whether you're an educator looking to engage your students or a learner seeking 
                to test your knowledge, our platform is designed to meet your needs.
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {[
                { icon: School, title: 'Quality Education', desc: 'Providing top-notch educational tools and resources', color: '#667eea' },
                { icon: EmojiEvents, title: 'Achievement Focused', desc: 'Helping students reach their full potential', color: '#FF9800' },
                { icon: People, title: 'Community Driven', desc: 'Building a supportive learning community', color: '#4CAF50' },
                // { icon: TrendingUp, title: 'Continuous Growth', desc: 'Constantly improving and evolving', color: '#9C27B0' }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card sx={{ 
                      height: '100%',
                      background: 'linear-gradient(135deg, #f8f9ff, #e3f2fd)',
                      borderRadius: 3,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      border: `2px solid ${item.color}20`,
                      '&:hover': {
                        boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                        borderColor: `${item.color}40`
                      }
                    }}>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ 
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                          borderRadius: '50%',
                          width: 70,
                          height: 70,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          boxShadow: `0 8px 20px ${item.color}40`
                        }}>
                          <item.icon sx={{ color: 'white', fontSize: 35 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Box sx={{ 
                mt: 5, 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea15, #764ba215)',
                borderRadius: 3,
                border: '2px solid #667eea20'
              }}>
                <Typography variant="h5" sx={{ color: '#333', mb: 1, fontWeight: 'bold' }}>
                  Join Us on This Journey
                </Typography>
                <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
                  If Not Yet Started!
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Be part of our growing community and experience the future of online assessments
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutUs;
