import { useState, useEffect } from 'react';

export const useLineUser = () => {
  const [lineUID, setLineUID] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從 URL 參數取得 LINE UID (Webhook 方式)
  const getLineUIDFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid') || urlParams.get('lineUID') || urlParams.get('user_id');
  };

  // 從 sessionStorage 取得 LINE UID
  const getLineUIDFromStorage = () => {
    return sessionStorage.getItem('lineUID');
  };

  // 儲存 LINE UID 到 sessionStorage
  const saveLineUIDToStorage = (uid) => {
    sessionStorage.setItem('lineUID', uid);
  };

  // 測試模式 - 產生測試用 UID
  const generateTestUID = () => {
    const testUID = 'TEST_USER_' + Date.now();
    const testProfile = {
      userId: testUID,
      displayName: '測試用戶',
      pictureUrl: '',
      statusMessage: '測試中'
    };
    
    setLineUID(testUID);
    setUserProfile(testProfile);
    saveLineUIDToStorage(testUID);
  };

  // 從後端API取得用戶資料 (如果有的話)
  const fetchUserProfile = async (uid) => {
    try {
      // 這裡可以呼叫您的後端API來取得更詳細的用戶資料
      const response = await fetch(`/api/user-profile.php?uid=${uid}`);
      if (response.ok) {
        const profileData = await response.json();
        if (profileData.success) {
          setUserProfile(profileData.profile);
          return;
        }
      }
    } catch (error) {
      console.log('無法從後端取得用戶資料，使用基本資料');
    }

    // 如果無法從後端取得，使用基本資料
    setUserProfile({
      userId: uid,
      displayName: '用戶',
      pictureUrl: '',
      statusMessage: ''
    });
  };

  // 初始化用戶資訊
  const initLineUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 1. 優先從 URL 參數取得 UID (Webhook 傳送)
      let uid = getLineUIDFromURL();
      
      // 2. 如果 URL 沒有，從 sessionStorage 取得
      if (!uid) {
        uid = getLineUIDFromStorage();
      }
      
      // 3. 如果都沒有，檢查是否為開發環境
      if (!uid) {
        const isDevelopment = process.env.NODE_ENV === 'development' || 
                            window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
          console.warn('開發環境：使用測試模式');
          generateTestUID();
          return;
        } else {
          throw new Error('無法取得 LINE User ID，請透過正確的連結進入');
        }
      }
      
      // 4. 設定 UID 並儲存
      setLineUID(uid);
      saveLineUIDToStorage(uid);
      
      // 5. 取得用戶資料
      await fetchUserProfile(uid);
      
    } catch (err) {
      console.error('初始化 LINE 用戶失敗:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 手動設定 LINE UID (供測試使用)
  const setManualLineUID = (uid) => {
    setLineUID(uid);
    saveLineUIDToStorage(uid);
    fetchUserProfile(uid);
  };

  // 清除用戶資料
  const clearUserData = () => {
    setLineUID(null);
    setUserProfile(null);
    sessionStorage.removeItem('lineUID');
  };

  useEffect(() => {
    initLineUser();
  }, []);

  return {
    lineUID,
    userProfile,
    isLoading,
    error,
    refetch: initLineUser,
    setManualLineUID,
    clearUserData,
    hasUID: !!lineUID
  };
};