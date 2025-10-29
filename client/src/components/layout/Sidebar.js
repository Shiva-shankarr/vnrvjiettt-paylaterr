import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaHome, 
  FaMoneyBillWave, 
  FaHistory, 
  FaUserCog,
  FaStore,
  FaChartBar,
  FaUsers,
  FaCog
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { path: '/student/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/student/balance', icon: <FaMoneyBillWave />, label: 'Balance' },
          { path: '/student/transactions', icon: <FaHistory />, label: 'Transactions' },
          { path: '/student/profile', icon: <FaUserCog />, label: 'Profile' }
        ];
      case 'provider':
        return [
          { path: '/provider/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/provider/menu', icon: <FaStore />, label: 'Menu' },
          { path: '/provider/orders', icon: <FaHistory />, label: 'Orders' },
          { path: '/provider/analytics', icon: <FaChartBar />, label: 'Analytics' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
          { path: '/admin/providers', icon: <FaStore />, label: 'Providers' },
          { path: '/admin/settings', icon: <FaCog />, label: 'Settings' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="sidebar bg-light border-end">
      <Nav className="flex-column p-3">
        {getMenuItems().map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar; 