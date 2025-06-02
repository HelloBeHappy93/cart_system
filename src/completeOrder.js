import React, { useState, useEffect,useMemo } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {Button,Box,TextField,IconButton,Snackbar,Accordion,AccordionSummary,AccordionDetails,Typography} from "@mui/material";
import {Table,TableHead,TableRow,TableCell,TableContainer,TableBody,Paper} from "@mui/material";
import {Check,Clear,ArrowDropDownRounded,ArrowBack} from "@mui/icons-material";
import TimeSlotSelector from "./icon/timeSlotSelector";
import SendBack from "./icon/sendOrderInfo";

export default function CompleteOrder(){
    
    const navigate = useNavigate();
    const {dateStr}=useParams();
    const {cartName}=useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [openSnackBar,setOpenSnackBar] = useState(false);

    useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setOrderProducts(storedItems);
    }, []);

    // 加總價格
    const totalPrice = useMemo(() => {
    return orderProducts.reduce((sum, item) => {
        const price = item.price || 0; // 確保有價格
        const qty = item.quantity || 0;
        return sum + price * qty;
    }, 0);
    }, [orderProducts]);

    const [state, setState] = useState({openClear:false});
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

    const handleSave = () => {
        const formData = {
        name,
        tel,
        email,
        timeSlot: selectedTimeSlot ? selectedTimeSlot.name : null,
        timeSlotId: selectedTimeSlot ? selectedTimeSlot.time_slot_id : null
        };
        localStorage.setItem("customerInfo", JSON.stringify(formData));
        setOpenSnackBar(true);
    };

    const handleReturnList=()=>{
        localStorage.removeItem("formData")
        navigate(`/ChooseDate/${dateStr}/${cartName}/confirm-order`)
    }

  const [timeSlot, setTimeSlot] = useState([]);
  
    useEffect(() => {
    const cartMealType = localStorage.getItem("selectedMealType");
    console.log("MealType from localStorage:", cartMealType);
  
    if (!cartMealType) return; // ❗️如果沒選擇就不送 request
  
    fetch("http://localhost/cart_system/getTimeSlot.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ meal: cartMealType })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("回傳的 time slot 資料：", data);
            setTimeSlot(data);
        })
        .catch((err) => console.error("抓資料錯誤：", err));
    }, []);
  

    return(
        <div>
            <Box
                sx={{
                    width: "60%",
                    margin: "40px auto",
                    bgcolor: "#ECF5FF",
                    borderRadius: 2,
                    boxShadow: 2,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
                >
                <Typography sx={{fontWeight: "bold", fontSize:"36px"}} align="center">訂單資訊</Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                    fullWidth
                    id="name"
                    label="訂購人姓名"
                    variant="outlined"
                    required
                    onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                    fullWidth
                    id="tel"
                    label="訂購人電話"
                    variant="outlined"
                    required
                    onChange={(e) => setTel(e.target.value)}
                    />
                </Box>

                <TextField
                    fullWidth
                    id="email"
                    label="電子郵件信箱（選填）"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TimeSlotSelector 
                    timeSlot={timeSlot} 
                    selectedTimeSlot={selectedTimeSlot}  
                    setSelectedTimeSlot={setSelectedTimeSlot} 
                />

                <Accordion>
                    <AccordionSummary expandIcon={<ArrowDropDownRounded />}>
                    <Typography>訂單商品資料</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>商品名稱</TableCell>
                            <TableCell align="center">單價</TableCell>
                            <TableCell align="center">數量</TableCell>
                            <TableCell align="center">總價</TableCell>
                            <TableCell align="center">備註</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderProducts.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="center">${row.price}</TableCell>
                                <TableCell align="center">{row.quantity}</TableCell>
                                <TableCell align="center">
                                ${row.price * row.quantity}
                                </TableCell>
                                <TableCell align="center">{row.remark||"無"}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </AccordionDetails>
                </Accordion>

                <Box sx={{ alignSelf: "flex-end", fontWeight: "bold", marginTop: 2,fontSize:"22px" }}>
                    訂單總額：${totalPrice}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <Button
                    sx={{
                        width: "220px",
                        backgroundColor: "#ADFEDC",
                        color: "#3C3C3C",
                        border: "2px solid #D7FFEE",
                        borderRadius: "16px",
                    }}
                    onClick={handleSave}
                    >
                    訂單資料確認
                    </Button>
                    <Button
                    sx={{
                        width: "220px",
                        backgroundColor: "#ADFEDC",
                        color: "#3C3C3C",
                        border: "2px solid #D7FFEE",
                        borderRadius: "16px",
                    }}
                    onClick={handleOpen}
                    >
                    取消訂單
                    </Button>
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openClear}
                onClose={handleClearClose}
                message="訂單將不儲存,確認以離開"
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
            <Button variant="contained" sx={{backgroundColor: " #00AEAE", position:'fixed',left:'20px',bottom:'30px'}} onClick={handleReturnList}>
                <ArrowBack />
                返回更改訂單
            </Button>
            <SendBack openSnackBar={openSnackBar} setOpenSnackBar={setOpenSnackBar}/>
        </div>
    );
}