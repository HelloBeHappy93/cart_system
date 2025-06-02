import React, { useState, useEffect, useMemo } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {Button,Box,Divider,List,ListItem,ListItemText,IconButton,Typography,Snackbar} from "@mui/material";
import {DeleteRounded,ArrowBack,Check,Clear} from "@mui/icons-material";
import QuantitySelector from "./icon/quantityCounter";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const {dateStr}=useParams();
  const {cartName}=useParams();
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setOrderProducts(storedItems);
  }, []);

  const handleDelete = (indexToDelete) => {
    const newItems = orderProducts.filter((_, index) => index !== indexToDelete);
    setOrderProducts(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
  };

  const handleQuantityChange = (index, newQty) => {
    if(newQty<1){
      handleDelete(index);
      return;
    }
    const updated = [...orderProducts];
    updated[index].quantity = newQty;
    setOrderProducts(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  // ✅ 加總價格
  const totalPrice = useMemo(() => {
    return orderProducts.reduce((sum, item) => {
      const price = item.price || 0; // 確保有價格
      const qty = item.quantity || 0;
      return sum + price * qty;
    }, 0);
  }, [orderProducts]);

    const [state, setState] = useState({
      open: false,
      openClear:false
    });
    const { open } = state;
  
    const handleClick = () => {
      setState({open: true });
      setTimeout(() => {
        navigate(`/ChooseDate/${dateStr}/${cartName}`);
      }, 1500);
    };

    const handleClose = () => {
      setState({ open: false });
    };

    const { openClear } = state;

    const handleOpen = () => {
      setState({openClear: true });
    };

    const handleClearClose = () => {
      setState({ openClear: false });
    };

    const handleReturnCart=()=>{
      localStorage.clear()
      setTimeout(() => {
        navigate(`/ChooseDate/${dateStr}/`);
      }, 1000);
    };
    
    const [warning,setWarning]=useState(false);
    const limitAmount =1;

    const handleWarningOn = () => {
      if (totalPrice < limitAmount) {
        setWarning(true);
      } else {
        setWarning(false);
        navigate(`/ChooseDate/${dateStr}/${cartName}/confirm-order/order-data`);
      }
    };


    const handleWarningClose=()=>{
      setWarning(false);
    };

    const handleWarningCloseTime=()=>{
      setTimeout(()=>{
        setWarning(false);
      },5000);
    };

  return (
    <div>
    <Box
      sx={{
        width: "75%",
        margin: "0 auto",
        position: "fixed",
        top: "20vh",
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <List>
        {orderProducts.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{fontSize:"20px"}}>單價：${item.price || 0}</Typography>
                  <QuantitySelector
                    value={item.quantity||0}
                    onChange={(qty) => handleQuantityChange(index, qty)}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`備註:${item.remark || ""}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {/* ✅ 總價區塊 */}
      <Box sx={{ p: 2, textAlign: "right", bgcolor: "#f0f0f0", borderTop: "1px solid #ccc" }}>
        <Typography variant="h6">總金額：${totalPrice}</Typography>
      </Box>
    </Box>
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
        maxWidth:'200px',
        display: 'flex',
        padding:"10px",
        position: 'fixed',
        flexWrap:'wrap',
        bottom: 10,
        gap:2,
        left: 16,
        zIndex: 1000,   // 確保在其他元素之上
        borderRadius: '50px',
        margin:"0 auto",}}>
          <Button variant="contained" sx={{backgroundColor: " #00AEAE"}} onClick={()=>handleOpen()}>
            重新選擇餐車
          </Button>
          <Button variant="contained" sx={{backgroundColor: " #00AEAE"}} onClick={()=>handleClick()}>
            <ArrowBack />
            繼續購物
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2000}
            message="商品仍會留在購物車中,現在前往商品頁繼續購物..."
          />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openClear}
        onClose={handleClearClose}
        message="離開此餐車購物車將被清空,確認以離開此餐車"
        action={
          <Box>
            <IconButton size="small"aria-label="close"color="inherit"onClick={handleReturnCart}>
              <Check/>
            </IconButton>
            <IconButton size="small"aria-label="close"color="inherit"onClick={handleClearClose}>
              <Clear/>
            </IconButton>
          </Box>
        }
      />
      <Button sx={{width:"220px",backgroundColor:" #ADFEDC", color:" #3C3C3C",border:'2px solid #D7FFEE',borderRadius: '16px',display: 'flex',position: 'fixed',bottom: "8%",left: '50%',transform: 'translateX(-50%)',margin:"0 auto",zIndex: 100}}
      onClick={handleWarningOn}>
        確認訂單明細
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={warning}
        onClose={handleWarningCloseTime}
        message="尚未有商品加入購物車,請加入商品"
        action={
          <Box>
            <IconButton size="small"aria-label="close"color="inherit"onClick={handleWarningClose}>
              <Clear/>
            </IconButton>
          </Box>
        }
      />
    </div>
  );
}