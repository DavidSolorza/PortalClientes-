import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState('#3B82F6');

  useEffect(() => {
    if (themeColor) {
      document.documentElement.style.setProperty('--brand-color', themeColor);
      // Generar tono un poco mas oscuro para hover
      document.documentElement.style.setProperty('--brand-color-dark', adjustColor(themeColor, -20));
    }
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
