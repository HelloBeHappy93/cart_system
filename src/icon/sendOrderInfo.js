import { useNavigate, useParams } from "react-router-dom";
import { Box, Snackbar, IconButton } from '@mui/material';
import { Check, Clear } from "@mui/icons-material";
import { useLineUserContext } from '../context/LineUserContext';

export default function SendBack({ openSnackBar, setOpenSnackBar }) {
  const navigate = useNavigate();
  const { cartName } = useParams();
  const { lineUID } = useLineUserContext();

  const handleSend = async () => {
    try {
      // 1. 收集所有資料
      const customerInfo = JSON.parse(localStorage.getItem("customerInfo") || "{}");
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const cartID = localStorage.getItem("selectedCartID");
      const mealType = localStorage.getItem("selectedMealType");
      const daySlot = localStorage.getItem("selectedDate");

      // 2. 第一步：生成訂單編號
      console.log("第一步：生成訂單編號...");
      const orderResponse = await fetch("http://mycart2025.infinityfreeapp.com/cart_system/generateOrderId.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          cart_id: cartID,
          line_uid: lineUID
        })
      });

      const orderResult = await orderResponse.json();
      console.log("訂單編號生成結果：", orderResult);

      if (!orderResult.success) {
        alert("訂單編號生成失敗：" + (orderResult.error || "未知錯誤"));
        return;
      }

      // 3. 第二步：準備完整訂單資料
      const completeOrderData = {
        orderNo: orderResult.orderNo,  // 使用生成的訂單編號
        line_uid: lineUID,
        name: customerInfo.name,
        tel: customerInfo.tel,
        email: customerInfo.email || "",
        day_slot: daySlot,
        mealType: mealType,
        time_slot_id: customerInfo.timeSlotId,
        products: cartItems.map(item => ({
          p_id: item.p_id,
          quantity: item.quantity,
          remark: item.remark || ""
        }))
      };

      console.log("第二步：儲存完整訂單資料...", completeOrderData);

      // 4. 第二步：儲存完整訂單
      const saveResponse = await fetch("http://mycart2025.infinityfreeapp.com/cart_system/saveCompleteOrder.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(completeOrderData)
      });

      const saveResult = await saveResponse.json();
      console.log("訂單儲存結果：", saveResult);

      if (saveResult.success) {
        console.log("訂單建立成功！訂單編號：", saveResult.orderNo);
        
        // 儲存 orderNo
        localStorage.setItem("orderId", saveResult.orderNo);
        
        // 清除購物車相關資料
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customerInfo");
        
        // 跳轉至訂單成功頁面
        navigate(`/order-success/${cartName}/${saveResult.orderNo}`);
      } else {
        alert("訂單儲存失敗：" + (saveResult.error || "未知錯誤"));
      }

    } catch (error) {
      console.error("系統錯誤：", error);
      
      // 更詳細的錯誤處理
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("網路連線錯誤，請檢查網路連線後再試");
      } else if (error.name === 'SyntaxError') {
        alert("伺服器回應格式錯誤，請聯絡系統管理員");
      } else {
        alert("系統發生未知錯誤，請稍後再試\n錯誤詳情：" + error.message);
      }
    }
  };

  const handleCloseSend = () => {
    setOpenSnackBar(false);
  };

  return (
    <Box>
      <Snackbar
        open={openSnackBar}
        onClose={handleCloseSend}
        message="確定要送出訂單嗎？"
        action={
          <>
            <IconButton
              size="small"
              aria-label="confirm"
              color="inherit"
              onClick={handleSend}
            >
              <Check />
            </IconButton>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSend}
            >
              <Clear />
            </IconButton>
          </>
        }
      />
    </Box>
  );
}
