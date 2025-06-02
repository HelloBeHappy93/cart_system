import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Button, Box, Alert, Typography } from '@mui/material';
import { LineUserProvider, useLineUserContext } from './context/LineUserContext';
import LoadingScreen from './components/LoadingScreen';
import ChooseDate from './chooseDate';
import ChooseCart from './chooseCart';
import Cart from './cartProducts';
import ShoppingCart from './shoppingCart';
import CompleteOrder from './completeOrder';
import FinishPage from './finishOrdering';
import './App.css';

function Home() {
  const navigate = useNavigate();
  const { lineUID, userProfile, isLoading, error } = useLineUserContext();

  if (isLoading) {
    return <LoadingScreen message="正在取得用戶資訊..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          無法取得 LINE 用戶資訊: {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          重新載入
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <h1>餐車訂購系統</h1>
      {userProfile && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body1">
            歡迎，{userProfile.displayName}!
          </Typography>
        </Box>
      )}
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
      }}>
        <Button 
          variant="outlined" 
          sx={{
            width: "240px",
            height: "60px",
            fontSize: "1.2rem"
          }}
          onClick={() => navigate('/ChooseDate')}
        >
          按下按鈕前往選擇日期
        </Button>
      </Box>
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ChooseDate" element={<ChooseDate />} />
        <Route path="/ChooseDate/:dateStr" element={<ChooseCart />} />
        <Route path="/ChooseDate/:dateStr/:cartName" element={<Cart />} />
        <Route path="/ChooseDate/:dateStr/:cartName/confirm-order" element={<ShoppingCart />} />
        <Route path="/ChooseDate/:dateStr/:cartName/confirm-order/order-data" element={<CompleteOrder />} />
        <Route path="/order-success/:cartName/:orderId" element={<FinishPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <LineUserProvider>
      <AppContent />
    </LineUserProvider>
  );
}

export default App;