import React,{useState,useEffect} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Button, Box, Badge, Snackbar,IconButton } from "@mui/material";
import { AppBar,CssBaseline,Toolbar,Typography}from "@mui/material";
import {ShoppingCart,Check,Clear} from '@mui/icons-material';
import CardProduct from "./cardProduct";

export default function Cart(props) {
  const[cartProduct,setProduct]=useState([]);
  const { dateStr } = useParams();
  const { cartName } = useParams();
  const [quantities, setQuantities] = useState({});
  const [remarks ,setRemarks] = useState({})
  const[counting,setCounting]=useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  fetch("http://localhost/cart_system/getProduct.php")
    .then((res) => res.json())
    .then((data) => {
      setProduct(data); // 把資料存進 state 中
    })
    .catch((err) => console.error("抓資料錯誤：", err));
}, []);

  function handleQuantityChange(productId, newQuantity) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  }

  const handleRemarkChange = (productId, newValue) => {
    setRemarks((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
    console.log(`產品 ${productId} 備註已更新:`, newValue);
  };

  const filterCartProduct = cartProduct.filter((item) =>item.cart_name === cartName);

  const [state, setState] = React.useState({
        open: false,
      });
  const { open } = state;

  const handleClick = () => {
    setState({open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const handleReturnLast=()=>{
    localStorage.clear()
    setTimeout(() => {
      navigate(`/ChooseDate/${dateStr}/`);
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      <AppBar component="nav" sx={{backgroundColor:"#FFD900"}}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' },backgroundColor:"#FFD900"}}
          >
            {cartName}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } ,backgroundColor:"#FFD900",gap:2}}>
           <Button  sx={{ color: '#fff' ,backgroundColor:"	#FFBB00"}} variant="contained" onClick={()=>handleClick()}>
                回到餐車選擇頁面
              </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ margin:"0 auto",padding:10,borderRadius:2, display:"flex",flexWrap: "wrap",justifyContent: "center",gap: 8, }}>
          {filterCartProduct.map((item) => (
            <CardProduct
              key={item.p_id}
              product={item}
              quantity={quantities[item.p_id] || 0}
              onQuantityChange={(qty) => handleQuantityChange(item.p_id, qty)}
              remark={remarks[item.p_id] || ""} 
              onRemarkChange={(newValue) => handleRemarkChange(item.p_id, newValue)} 
              counting={counting}
              setCounting={setCounting}
            />
          ))}
      </Box>
      <Box sx={{
        '& > :not(style)': { m: 1 },
        display: 'flex',
        padding:"10px",
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,   // 確保在其他元素之上
        borderRadius: '50px',
        margin:"0 auto",}}>
          <Badge badgeContent={counting} color="primary">
            <Button variant="contained" sx={{backgroundColor:" #8CEA00",width:"300px",height:"50px"}} onClick={()=>navigate(`/ChooseDate/${dateStr}/${cartName}/confirm-order`)}>
              前往購物車
              <ShoppingCart />
            </Button>
          </Badge>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        message="離開此餐車購物車將被清空,確認以離開此餐車"
        action={
          <Box>
            <IconButton size="small"aria-label="close"color="inherit"onClick={handleReturnLast}>
              <Check/>
            </IconButton>
            <IconButton size="small"aria-label="close"color="inherit"onClick={handleClose}>
              <Clear/>
            </IconButton>
          </Box>
        }
      />
    </Box>
  );
}