import { type ReactNode } from "react";
import { Layout as AntLayout, Menu, Typography, Flex } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CalculatorOutlined,
  LineChartOutlined,
  BarChartOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Header, Content } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    key: "/",
    icon: <CalculatorOutlined />,
    label: "Calculator",
  },
  {
    key: "/evolutie-venituri",
    icon: <LineChartOutlined />,
    label: "Evoluție Venituri",
  },
  {
    key: "/comparatie",
    icon: <BarChartOutlined />,
    label: "Comparație PFA vs SRL",
  },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Flex align="center" gap={12}>
          <BankOutlined style={{ fontSize: 24, color: "#1677ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            Calculator Taxe România
          </Title>
        </Flex>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            minWidth: 400,
            justifyContent: "flex-end",
            border: "none",
          }}
        />
      </Header>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        {children}
      </Content>
    </AntLayout>
  );
}

