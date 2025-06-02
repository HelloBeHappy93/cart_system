import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useLineUserContext } from '../context/LineUserContext';

const LineUIDDebugger = () => {
  const { lineUID, userProfile, setManualLineUID, clearUserData } = useLineUserContext();
  const [inputUID, setInputUID] = useState('');

  // 只在開發環境顯示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        開發除錯工具
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          當前 LINE UID: {lineUID || '未設定'}
        </Typography>
        <Typography variant="body2">
          用戶名稱: {userProfile?.displayName || '未知'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="輸入測試 LINE UID"
          value={inputUID}
          onChange={(e) => setInputUID(e.target.value)}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (inputUID.trim()) {
              setManualLineUID(inputUID.trim());
              setInputUID('');
            }
          }}
        >
          設定
        </Button>
      </Box>

      <Button
        variant="outlined"
        size="small"
        color="warning"
        onClick={clearUserData}
      >
        清除用戶資料
      </Button>
    </Paper>
  );
};

export default LineUIDDebugger;