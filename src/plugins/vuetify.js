// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/sass/variables.scss";

// Vuetify
import { createVuetify } from "vuetify";

const customTheme = {
  dark: false,
  colors: {
    primary: "#FF5252",
    secondary: "#E468A2",
    success: "#4CAF50",
    info: "#02BDFE",
    warning: "#FCBE01",
    error: "#D32F2F",
    surface: "#FFFFFF",
  },
};

export default createVuetify({
  theme: {
    options: {
      customProperties: true,
    },
    defaultTheme: "customTheme",
    themes: {
      customTheme,
    },
  },
});
