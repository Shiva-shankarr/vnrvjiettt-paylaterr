import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { FiCreditCard, FiShoppingBag, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    user: {},
    stats: {},
    recentOrders: [],
    upcomingEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/student/dashboard');
      setDashboardData(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const creditUsagePercentage = dashboardData.user.currentBalance 
    ? (dashboardData.user.currentBalance / dashboardData.user.creditLimit) * 100 
    : 0;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Welcome back, {dashboardData.user.firstName}!</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiCreditCard size={30} className="text-primary mb-2" />
              <h6 className="text-muted">Available Credit</h6>
              <h3 className="text-success">₹{dashboardData.stats.availableCredit}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiDollarSign size={30} className="text-warning mb-2" />
              <h6 className="text-muted">Current Balance</h6>
              <h3 className="text-warning">₹{dashboardData.user.currentBalance}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiShoppingBag size={30} className="text-info mb-2" />
              <h6 className="text-muted">Total Orders</h6>
              <h3>{dashboardData.stats.totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FiCalendar size={30} className="text-danger mb-2" />
              <h6 className="text-muted">Events Registered</h6>
              <h3>{dashboardData.upcomingEvents.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Credit Usage */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Credit Usage</h5>
          <ProgressBar>
            <ProgressBar
              variant={creditUsagePercentage > 80 ? 'danger' : creditUsagePercentage > 60 ? 'warning' : 'success'}
              now={creditUsagePercentage}
              label={`${creditUsagePercentage.toFixed(1)}%`}
            />
          </ProgressBar>
          <div className="d-flex justify-content-between mt-2 text-muted small">
            <span>Used: ₹{dashboardData.user.currentBalance}</span>
            <span>Limit: ₹{dashboardData.user.creditLimit}</span>
          </div>
        </Card.Body>
      </Card>

    </Container>
  );
};

export default StudentDashboard;
