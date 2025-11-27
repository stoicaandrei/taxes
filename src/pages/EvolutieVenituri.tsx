import { useState, useMemo } from "react";
import { Card, InputNumber, Row, Col, Typography, Flex, Slider } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import { taxePfa, taxeSrl } from "../taxes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

export default function EvolutieVenituri() {
  const [cheltuieliAnuale, setCheltuieliAnuale] = useState<number>(10000);
  const [procentDividende, setProcentDividende] = useState<number>(50);
  const [venitMin, setVenitMin] = useState<number>(100000);
  const [venitMax, setVenitMax] = useState<number>(500000);
  const [step] = useState<number>(10000);

  const data = useMemo(() => {
    const points: Array<{
      venit: number;
      pfaNet: number;
      srlNet: number;
      pfaTaxe: number;
      srlTaxe: number;
    }> = [];

    for (let venit = venitMin; venit <= venitMax; venit += step) {
      const rezultatePfa = taxePfa(venit, cheltuieliAnuale);
      const profit = venit - cheltuieliAnuale;
      const dividendeAnuale = profit * (procentDividende / 100);
      const rezultateSrl = taxeSrl(venit, cheltuieliAnuale, dividendeAnuale);

      points.push({
        venit,
        pfaNet: rezultatePfa.venitNetDupaTaxe,
        srlNet: rezultateSrl.divdendeNete + rezultateSrl.venitNetDupaTaxe,
        pfaTaxe: rezultatePfa.totalTaxe,
        srlTaxe: rezultateSrl.totalTaxe,
      });
    }

    return points;
  }, [venitMin, venitMax, step, cheltuieliAnuale, procentDividende]);

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
          <LineChartOutlined style={{ marginRight: 12 }} />
          Evoluție Venituri
        </Title>
        <Text type="secondary">
          Vizualizează evoluția taxelor și veniturilor nete în funcție de venit
        </Text>
      </Flex>

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
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
          <Col xs={24} md={6}>
            <Flex vertical gap={8}>
              <Text strong>Procent Dividende din Profit (SRL)</Text>
              <InputNumber
                size="large"
                value={procentDividende}
                onChange={(val) => setProcentDividende(val || 0)}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number(value?.replace(/%/g, "") || 0)}
                style={{ width: "100%" }}
              />
            </Flex>
          </Col>
          <Col xs={24} md={6}>
            <Flex vertical gap={8}>
              <Text strong>
                Venit Minim: {venitMin.toLocaleString("ro-RO")} RON
              </Text>
              <Slider
                min={30000}
                max={500000}
                step={10000}
                value={venitMin}
                onChange={setVenitMin}
                tooltip={{
                  formatter: (val) => `${val?.toLocaleString("ro-RO")} RON`,
                }}
              />
            </Flex>
          </Col>
          <Col xs={24} md={6}>
            <Flex vertical gap={8}>
              <Text strong>
                Venit Maxim: {venitMax.toLocaleString("ro-RO")} RON
              </Text>
              <Slider
                min={100000}
                max={1000000}
                step={10000}
                value={venitMax}
                onChange={setVenitMax}
                tooltip={{
                  formatter: (val) => `${val?.toLocaleString("ro-RO")} RON`,
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      <Card title="Venit Net După Taxe">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="venit"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Venit Anual (RON)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Venit Net (RON)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number) =>
                `${value.toLocaleString("ro-RO")} RON`
              }
              labelFormatter={(value) =>
                `Venit: ${value.toLocaleString("ro-RO")} RON`
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pfaNet"
              stroke="#1677ff"
              strokeWidth={2}
              name="PFA - Venit Net"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="srlNet"
              stroke="#722ed1"
              strokeWidth={2}
              name="SRL - Venit Net"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Total Taxe">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="venit"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Venit Anual (RON)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Taxe (RON)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number) =>
                `${value.toLocaleString("ro-RO")} RON`
              }
              labelFormatter={(value) =>
                `Venit: ${value.toLocaleString("ro-RO")} RON`
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pfaTaxe"
              stroke="#ff4d4f"
              strokeWidth={2}
              name="PFA - Total Taxe"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="srlTaxe"
              stroke="#fa8c16"
              strokeWidth={2}
              name="SRL - Total Taxe"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Flex>
  );
}
