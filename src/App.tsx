import React, { useEffect } from 'react';
import Payment from './pages/payment';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "Payment"
  }, [])
  
  return (
    <Payment />
  );
}

export default App;
