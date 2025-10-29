import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store';

// Lazy loaded components
const Home = React.lazy(() => import('./features/home/Home'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={
          <div className="app loading">
            <div className="spinner"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
