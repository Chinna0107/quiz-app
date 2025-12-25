import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, AppBar, Toolbar, Avatar, Button,
  List, ListItem, ListItemText, ListItemAvatar, Chip, IconButton
} from '@mui/material';
import { ArrowBack, AdminPanelSettings, CheckCircle, Cancel, Person, Quiz } from '@mui/icons-material';
import { motion } from 'framer-motion';

const QuizApprovals = ({ user }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 2000); // Check for new requests every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('quizRequests') || '[]');
    const pendingRequests = storedRequests.filter(r => r.status === 'pending');
    setRequests(pendingRequests);
  };

  const handleApproval = (requestId, approved) => {
    const storedRequests = JSON.parse(localStorage.getItem('quizRequests') || '[]');
    const updatedRequests = storedRequests.map(r => 
      r.id === requestId ? { ...r, status: approved ? 'approved' : 'denied' } : r
    );
    localStorage.setItem('quizRequests', JSON.stringify(updatedRequests));
    
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }} elevation={0}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'white', mr: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Quiz Approvals</Typography>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
            <AdminPanelSettings />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 'bold' }}>
              Pending Quiz Requests ({requests.length})
            </Typography>
            
            {requests.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                No pending requests
              </Typography>
            ) : (
              <List>
                {requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem sx={{ 
                      mb: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f8f9fa, #ffffff)'
                    }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#667eea' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{request.studentName}</Typography>
                            <Chip icon={<Quiz />} label={request.quizTitle} size="small" />
                          </Box>
                        }
                        secondary={`Requested at: ${new Date(request.timestamp).toLocaleString()}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleApproval(request.id, true)}
                          sx={{ bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#45a049' } }}
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleApproval(request.id, false)}
                          sx={{ bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default QuizApprovals;