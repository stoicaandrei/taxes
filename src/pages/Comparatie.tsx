import { useState, useMemo } from "react";
import { Card, InputNumber, Row, Col, Typography, Flex } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { taxePfa, taxeSrl } from "../taxes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;

const COLORS = {
  pfa: "#1677ff",
  srl: "#722ed1",
  taxe: "#ff4d4f",
  net: "#52c41a",
};

export default function Comparatie() {
  const [venitAnual, setVenitAnual] = useState<number>(100000);
  const [cheltuieliAnuale, setCheltuieliAnuale] = useState<number>(10000);
  const [dividendeAnuale, setDividendeAnuale] = useState<number>(50000);

  const rezultatePfa = useMemo(
    () => taxePfa(venitAnual, cheltuieliAnuale),
    [venitAnual, cheltuieliAnuale]
  );

  const rezultateSrl = useMemo(
    () => taxeSrl(venitAnual, cheltuieliAnuale, dividendeAnuale),
    [venitAnual, cheltuieliAnuale, dividendeAnuale]
  );


  const barData = [
    {
      name: "PFA",
      "Venit Net": rezultatePfa.venitNetDupaTaxe,
      "Total Taxe": rezultatePfa.totalTaxe,
    },
    {
      name: "SRL",
      "Venit Net": rezultateSrl.divdendeNete + rezultateSrl.venitNetDupaTaxe,
      "Total Taxe": rezultateSrl.totalTaxe,
    },
  ];

  const pieDataPfa = [
    { name: "Venit Net", value: rezultatePfa.venitNetDupaTaxe },
    { name: "Total Taxe", value: rezultatePfa.totalTaxe },
  ];

  const pieDataSrl = [
    {
      name: "Venit Net",
      value: rezultateSrl.divdendeNete + rezultateSrl.venitNetDupaTaxe,
    },
    { name: "Total Taxe", value: rezultateSrl.totalTaxe },
  ];

  return (
    <Flex
      vertical
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        minHeight: "calc(100vh - 64px)",
      }}
      gap={24}
    >
      <Flex vertical align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <BarChartOutlined style={{ marginRight: 12 }} />
          Comparație PFA vs SRL
        </Title>
        <Text type="secondary">
          Compară vizual regimurile fiscale PFA și SRL
        </Text>
      </Flex>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Flex vertical gap={8}>
              <Text strong>Venit Anual</Text>
              <InputNumber
                size="large"
                value={venitAnual}
                onChange={(val) => setVenitAnual(val || 0)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value?.replace(/,/g, "") || 0)}
                addonAfter="RON"
                style={{ width: "100%" }}
              />
            </Flex>
          </Col>
          <Col xs={24} md={8}>
            <Flex vertical gap={8}>
              <Text strong>Cheltuieli Anuale</Text>
              <InputNumber
                size="large"
                value={cheltuieliAnuale}
                onChange={(val) => setCheltuieliAnuale(val || 0)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value?.replace(/,/g, "") || 0)}
                addonAfter="RON"
                style={{ width: "100%" }}
              />
            </Flex>
          </Col>
          <Col xs={24} md={8}>
            <Flex vertical gap={8}>
              <Text strong>Dividende Anuale (SRL)</Text>
              <InputNumber
                size="large"
                value={dividendeAnuale}
                onChange={(val) => setDividendeAnuale(val || 0)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value?.replace(/,/g, "") || 0)}
                addonAfter="RON"
                style={{ width: "100%" }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      <Card title="Comparație Bar Chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: "Sumă (RON)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString("ro-RO")} RON`}
            />
            <Legend />
            <Bar dataKey="Venit Net" fill={COLORS.net} />
            <Bar dataKey="Total Taxe" fill={COLORS.taxe} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Distribuție PFA">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataPfa}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieDataPfa.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.net : COLORS.taxe}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString("ro-RO")} RON`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Distribuție SRL">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataSrl}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieDataSrl.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.net : COLORS.taxe}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString("ro-RO")} RON`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
}

