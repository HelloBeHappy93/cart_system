import { Autocomplete, TextField } from '@mui/material';

const TimeSlotSelector = ({ timeSlot, selectedTimeSlot, setSelectedTimeSlot }) => {
  return (
    <Autocomplete
      id="timeSlotSelect"
      options={timeSlot}
      value={selectedTimeSlot}
      onChange={(event, newValue) => setSelectedTimeSlot(newValue)}
      getOptionLabel={(option) => option.name || ""} // 顯示 name
      renderInput={(params) => <TextField {...params} label="領餐時間" />}
      sx={{ width: 300 }}
    />
  );
};

export default TimeSlotSelector;
