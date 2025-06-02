import React,{useEffect, useState } from "react";
import {Button,Box} from '@mui/material';
import { useNavigate } from "react-router-dom";

function ChooseDate(){
    const [dates,setDates]=useState([]);
    const navigate=useNavigate();

    useEffect(()=>{
        const today = new Date();
        const newDates = [];
        const weekdays=["日","一","二","三","四","五","六"];

        for(let i=0;i<14;i++){
            const date = new Date(today);
            date.setDate(today.getDate()+i);
            const month = String(date.getMonth()+1).padStart(2,"0");
            const day = String(date.getDate()).padStart(2,"0");
            const weekday = weekdays[date.getDay()];
            newDates.push({label:`${month}/${day}(${weekday})`,value:`${month}${day}`});
        }
        setDates(newDates);
    },[]);

    return (
        <div>
            <h1>
                請選擇日期
            </h1>
            <Box sx={{
                backgroundColor: "#d9ffff",
                margin:"0 auto",
                padding:10,
                borderRadius:2,
                display:"flex",
                flexWrap: "wrap",
                gap: 2,
                maxWidth: "55vw",
                maxHeight: "50vh",
                }}
            >
                {dates.map((date,index)=>(
                    <Button sx={{
                        width:"80px",
                        margin:"0 auto"
                    }} 
                    key ={index} 
                    variant="contained" 
                    onClick={()=>navigate(`/ChooseDate/${date.value}`)}>
                        {date.label}
                    </Button>
                ))}
            </Box>
            <Button sx={{position:'fixed',bottom:'20px',left:'20px'}}variant="contained" onClick={()=>navigate(`/`)}>上一頁</Button>
        </div>
    );
}

export default ChooseDate;