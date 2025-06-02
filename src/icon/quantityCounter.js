import { Button, ButtonGroup} from "@mui/material";

export default function QuantitySelector({ value = 0, onChange }) {
  const maxValue = 5;
  const minValue = 0;

  const handleIncrease = () => {
    if (onChange && value < maxValue) {
      onChange(value + 1);
    }
  };

  const handleDecrease = () => {
    if (onChange && value > minValue) {
      onChange(value - 1);
    }
  };

  return (
    <ButtonGroup size="small" variant="outlined" sx={{backgroundColor:" #ADADAD",border:'0.3px solid #000000'}}>
      <Button onClick={handleDecrease} sx={{backgroundColor:" #ADADAD",color:"#ffffff",border:'0.3px solid #000000'}}>-</Button>
      <Button disabled sx={{backgroundColor:" #ffffff" ,color:"#000000",border:'0.8px solid #000000'}}>{value}</Button>
      <Button onClick={handleIncrease} sx={{backgroundColor:" #ADADAD" ,color:"#ffffff",border:'0.3px solid #000000'}}>+</Button>
    </ButtonGroup>
  );
}
