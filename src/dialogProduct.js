import React from "react";
import PropTypes from 'prop-types';
import {Button,Box,TextField} from '@mui/material';
import { Accordion,AccordionSummary,AccordionDetails} from "@mui/material";
import {ArrowDropDownRounded,ShoppingCart} from '@mui/icons-material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import QuantitySelector from "./icon/quantityCounter";

function SimpleDialog({ onClose, open, product, quantity, onQuantityChange,remark,onRemarkChange, addProductInCart}) {
  const handleClose = () => {
    onClose();
  };

  const handleChange = (event) => {
    onRemarkChange(event.target.value); 
  }

  const handleItemClick = () => {
    addProductInCart();
    onQuantityChange(0);
    onRemarkChange('');
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} disableEnforceFocus={false} disableAutoFocus={false}>
      <DialogTitle>{product.cart_name}</DialogTitle>
      <Box>
        <img
          src={product.pic?.trim() || "/cart_image/no_image.jpeg"}
          alt={product.name}
          style={{ width: "500px", height: "300px", objectFit: "cover", border: "1px solid #ccc" }}
        />
        <Typography gutterBottom variant="h5" component="div" sx={{padding:"10px"}}>
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" sx={{paddingLeft:"10px", paddingTop:"5px"}}>
          {product.price}元
        </Typography>
        <Accordion sx={{width:"100%",padding:1}}>
          <AccordionSummary expandIcon={<ArrowDropDownRounded />} aria-controls="panel2-content" id="panel2-header">
            <Typography component="span">詳細內容</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{display:'flex',flexWrap:'wrap'}}>
            {product.description?.trim() 
              ? product.description 
              : '商家無提供資訊'}
          </AccordionDetails>
        </Accordion>
        <br/>
        <TextField id="remark" value={remark} label="備註(若無則空白)" variant="outlined" multiline sx={{width:"98%",padding:1}} onChange={handleChange}/> 
        <br/>
        <Box sx={{ padding: "10px" }}>
          <QuantitySelector value={quantity} onChange={onQuantityChange} />
        </Box>
        <Box 
        sx={{display: 'flex',justifyContent:'flex-end', padding:"10px"}}>
            <Button autoFocus aria-label="cart" variant='contained' sx={{backgroundColor:" #7B7B7B"}} onClick={() => handleItemClick()}>
                加入購物車
                <ShoppingCart />
            </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  addProductInCart: PropTypes.func.isRequired,
  remark: PropTypes.string.isRequired,
  onRemarkChange: PropTypes.func.isRequired
};

export default function DialogProduct({ product, quantity, onQuantityChange, addProductInCart,remark,onRemarkChange }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };


  return (
    <div>
      <br />
      <Button variant="outlined" onClick={handleClickOpen} sx={{color:"#000000", backgroundColor:"#F0F0F0", border: '1px solid #000000', borderRadius: '1px'}}>
        查看商品詳細內容
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        product={product}
        quantity={quantity} 
        onQuantityChange={onQuantityChange} 
        addProductInCart={addProductInCart}
        remark={remark}
        onRemarkChange={onRemarkChange}
      />
    </div>
  );
}
