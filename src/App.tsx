import { useState, useEffect } from "react";
import ApexChart from "./components/ApexCharts.tsx";
import type { TTheme } from "./types.ts";

function App() {
  const [theme, setTheme] = useState<TTheme>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
      <div>
        <div style={{ padding: 16 }}>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          </button>
        </div>

        <ApexChart theme={theme} />
      </div>
  );
}

export default App;