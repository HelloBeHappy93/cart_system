import Card from '@mui/material/Card';
import {Button,Box} from '@mui/material';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {ShoppingCart} from '@mui/icons-material';
import DialogProduct from "./dialogProduct";
import QuantitySelector from './icon/quantityCounter';

export default function CardProduct({ product, quantity, onQuantityChange,remark,onRemarkChange, counting ,setCounting }) {
  
  const handleAddToCartById = () => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const index = currentCart.findIndex(item => item.id === product.p_id);

    if (index > -1) {
      currentCart[index].quantity += quantity;
      if (remark && remark.trim() !== '') {
        currentCart[index].remark = remark;
      }
    } 
    else {
      currentCart.push({
        id: product.p_id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        remark: remark||''
      });
    }
    setCounting(prev => prev + quantity);
    onQuantityChange(0);
    onRemarkChange('');

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    console.log("已加入購物車", currentCart);
  };
  
  return (
    <Card variant="outlined" sx={{ width: 360 ,height: 280}}>
      <Box>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', width: 360 ,height: 60,}}
          >
            <Box sx={{width:220,height:60,fontSize:"110%"}}>
                {product.name}
            </Box>
            <Box sx={{padding:5 ,fontSize:"120%"}}>
              {product.price}元
            </Box>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2 ,gap:"3px"}}>
          <Box sx={{ p: 2 ,gap:"10%",margin:"0 auto",display:"flex",}}>
            <QuantitySelector value={quantity} onChange={onQuantityChange} />
            <Button aria-label="cart" variant='contained' sx={{backgroundColor:" #7B7B7B"}} onClick={handleAddToCartById}>
              加入購物車
              <ShoppingCart />
            </Button>
          </Box>
          <DialogProduct
            product={product}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            remark={remark}
            onRemarkChange={onRemarkChange}
            addProductInCart={handleAddToCartById}
          />

        </Box>
      </Box>
    </Card>
  );
}