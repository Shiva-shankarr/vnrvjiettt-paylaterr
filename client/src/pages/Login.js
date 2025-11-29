import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(loginStart());
      
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
        
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        toast.success('Login successful!');
        
        // Navigate based on role
        const role = response.data.user.role.toLowerCase();
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">PayLater</h2>
                <p className="text-muted">VNRVJIET Campus Credit System</p>
              </div>
              
              <h4 className="mb-4">Welcome Back!</h4>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiMail />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="your.email@vnrvjiet.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Use your VNRVJIET email address
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FiLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="me-2" />
                      Login
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-bold">
                    Register here
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-muted small">
                  Forgot password?
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;