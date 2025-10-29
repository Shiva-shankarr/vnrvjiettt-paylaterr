import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} className="text-center">
            <h1 className="display-4 mb-4">PayLater - VNRVJIET</h1>
            <p className="lead mb-4">
              Welcome to VNRVJIET's Campus Credit System. Pay for campus services now,
              settle later with ease.
            </p>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="lg"
                className="px-4 me-sm-3"
              >
                Get Started
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline-primary"
                size="lg"
                className="px-4"
              >
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home; 