import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Calculator from "./pages/Calculator";
import EvolutieVenituri from "./pages/EvolutieVenituri";
import Comparatie from "./pages/Comparatie";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/evolutie-venituri" element={<EvolutieVenituri />} />
            <Route path="/comparatie" element={<Comparatie />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
