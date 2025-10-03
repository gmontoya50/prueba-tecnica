import { PaletteColorOptions } from "@mui/material";

declare module '@mui/material/styles' {
  interface PaletteOptions {
    gray?: PaletteColorOptions;
  }
  interface TypeText {
    contrastText?: string;
  }
}