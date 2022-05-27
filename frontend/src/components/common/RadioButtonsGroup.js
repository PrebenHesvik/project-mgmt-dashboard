import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RadioButtonsGroup({ label, defaultValue, values }) {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={defaultValue}
        name="radio-buttons-group"
        value={formik.values.inspection_year}
        onChange={formik.handleChange}
        row
      >
        {values.map((value) => {
          return (
            <FormControlLabel value={value} control={<Radio />} label={value} />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
