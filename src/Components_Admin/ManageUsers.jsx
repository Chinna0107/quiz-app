import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, AppBar, Toolbar, Avatar, 
  Button, Chip, Switch, IconButton
} from '@mui/material';
import { ArrowBack, AdminPanelSettings, ExitToApp, Block, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../config/api';

const ManageUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.put(`/api/admin/users/${userId}/block`, { blocked: !isBlocked });
      Swal.fire({
        icon: 'success',
        title: isBlocked ? 'User Unblocked!' : 'User Blocked!',
        timer: 2000,
        showConfirmButton: false
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user status'
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
      <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }} elevation={0}>
        <Toolbar>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin')} sx={{ color: 'white', mr: 2 }}>
            Back to Dashboard
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Manage Users</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <AdminPanelSettings />
            </Avatar>
            <Typography sx={{ color: 'white' }}>{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 'bold' }}>
                User Management
              </Typography>
              
              {loading ? (
                <Typography sx={{ textAlign: 'center', py: 4 }}>Loading users...</Typography>
              ) : users.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Joined</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((userData, index) => (
                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                          <TableCell>{userData.name}</TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={userData.is_blocked ? <Block /> : <CheckCircle />}
                              label={userData.is_blocked ? 'Blocked' : 'Active'}
                              color={userData.is_blocked ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {new Date(userData.created_at).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant={userData.is_blocked ? 'contained' : 'outlined'}
                              color={userData.is_blocked ? 'success' : 'error'}
                              size="small"
                              onClick={() => handleBlockUser(userData.id, userData.is_blocked)}
                              sx={{ borderRadius: 2 }}
                            >
                              {userData.is_blocked ? 'Unblock' : 'Block'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                  No users found
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ManageUsers;