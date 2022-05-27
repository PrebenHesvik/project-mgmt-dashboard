import { styled } from "@mui/material/styles";
import { TextField, MenuItem } from "@mui/material";

export const StyledTextField = styled(
  TextField,
  {}
)({
  marginBottom: 30,

  boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.4)",
  input: {
    color: "black",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
  label: {
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: "500",
  },
  fieldset: {
    border: "none",
  },
  svg: {
    color: "rgba(0, 0, 0, 0.5)",
  },

  MuiSelect: {
    backgroundColor: "red",
  },

  select: {
    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.4)",
    color: "black",
    backgroundColor: "red",
  },
});

export const StyledMenuItem = styled(
  MenuItem,
  {}
)({
  backgroundColor: "white",
  color: "black",

  "&MuiList-root": {
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "white",
  },

  "&:hover, &.Mui-focusVisible, &.Mui-selected": {
    backgroundColor: "lightgray",
  },
});
