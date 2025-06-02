import React,{useState,useEffect} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Button,Tab,Tabs, Box } from "@mui/material";
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const formatDate = (fullDate) => { ///把2025-05-31轉換為0531
  const date = new Date(fullDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}${day}`;
};

export default function ChooseCart() {
  const { dateStr } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("lunch");
  const [carts, setcarts] = useState([]);

  useEffect(() => {
  fetch("http://mycart2025.infinityfreeapp.com/cart_system/getCartName.php")
    .then((res) => res.json())
    .then((data) => {
      setcarts(data); // 把資料存進 state 中
    })
    .catch((err) => console.error("抓資料錯誤：", err));
}, []);
  const lunchCarts = carts.filter(
    (item) => formatDate(item.day_slot) === dateStr && item.mealType === "lunch"
  );
  const dinnerCarts = carts.filter(
    (item) => formatDate(item.day_slot) === dateStr && item.mealType === "dinner"
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }//點選時有顏色

  const handleSelectCart = (cart) => {
    // 儲存選擇
    localStorage.setItem("selectedCartID", cart.b_id);
    localStorage.setItem("selectedDate", cart.day_slot);
    localStorage.setItem("selectedMealType",cart.mealType);

    // 清空購物車暫存（避免跨餐車）
    localStorage.removeItem("cartItems");

    // 跳轉到商品頁
    navigate(`/ChooseDate/${dateStr}/${cart.cart_name}`);
  };

  const handleDeleteOldDate=()=>{
    localStorage.clear();
    navigate(`/ChooseDate`);
  }

  return (
    <div>
        <Box sx={{ padding: 3 }}>
            <h2>
                {dateStr}
            </h2>
            <h3>
                請選擇餐車
            </h3>
        </Box>
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="午餐" value="lunch" />
                <Tab label="晚餐" value="dinner"/>
            </Tabs>
            <CustomTabPanel value={value} index="lunch">   
                <Box sx={{
                    maxWidth:"50%",
                    maxHeight:"70%",
                    margin:"0 auto",
                    padding:10,
                    gap: 2,
                    display:"flex",
                    bgcolor:"#ffffff"
                }}>
                    {lunchCarts.map((item) => ( 
                        <Button sx={{
                                backgroundColor:"	#A3D1D1",
                                margin:"0 auto",
                            }} variant="contained" key={item.b_id} onClick={()=>handleSelectCart(item)}>
                            {item.cart_name}
                        </Button>
                    ))}
                </Box>
                
            </CustomTabPanel>
            <CustomTabPanel value={value} index="dinner">
                <Box sx={{
                    maxWidth:"50%",
                    maxHeight:"70%",
                    margin:"0 auto",
                    padding:10,
                    gap: 2,
                    display:"flex",
                    bgcolor:"#ffffff"
                }}>
                    {dinnerCarts.map((item) => (
                        <Button sx={{
                                backgroundColor:"	#A3D1D1",
                                margin:"0 auto"
                            }} variant="contained" key={item.b_id} onClick={()=>handleSelectCart(item)} >
                            {item.cart_name}
                        </Button>
                    ))}
                </Box>
            </CustomTabPanel>
        </Box>
        <Button sx={{position:'fixed',bottom:'20px',left:'20px'}}variant="contained" onClick={()=>handleDeleteOldDate()}>上一頁</Button>
    </div>
  );
 }
