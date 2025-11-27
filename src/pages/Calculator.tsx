import { useState, useMemo } from "react";
import {
  Card,
  InputNumber,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Space,
  Tag,
  Flex,
} from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { taxePfa, taxeSrl } from "../taxes";

const { Title, Text } = Typography;

export default function Calculator() {
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

  const venitNet = venitAnual - cheltuieliAnuale;
  const procentTaxePfa =
    venitNet > 0 ? (rezultatePfa.totalTaxe / venitNet) * 100 : 0;
  const procentTaxeSrl =
    venitNet > 0 ? (rezultateSrl.totalTaxe / venitNet) * 100 : 0;

  return (
    <Flex
      vertical
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "calc(100vh - 64px)",
      }}
      justify="center"
    >
      <Flex vertical align="center" style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>
          <BankOutlined style={{ marginRight: 12 }} />
          Calculator Taxe România
        </Title>
        <Text type="secondary">Compară regimul fiscal PFA vs SRL</Text>
      </Flex>

      <Card style={{ marginBottom: 24 }}>
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

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* PFA Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>PFA</span>
                <Tag color="blue">Persoană Fizică Autorizată</Tag>
              </Space>
            }
            style={{ height: "100%" }}
          >
            <Statistic
              title="Venit Net După Taxe"
              value={rezultatePfa.venitNetDupaTaxe}
              precision={0}
              valueStyle={{ color: "#52c41a", fontSize: 32, fontWeight: 700 }}
              prefix={<DollarOutlined />}
              suffix="RON"
            />

            <Divider />

            <Title level={5}>Detalii Taxe</Title>

            <Flex vertical gap={12}>
              <Flex justify="space-between">
                <Text type="secondary">CAS (pensie - 25%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultatePfa.casDatorat.toLocaleString("ro-RO")} RON
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">CASS (sănătate - 10%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultatePfa.cassDatorat.toLocaleString("ro-RO")} RON
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">Impozit pe venit (10%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultatePfa.impozitDatorat.toLocaleString("ro-RO")} RON
                </Text>
              </Flex>
            </Flex>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Total Taxe"
                  value={rezultatePfa.totalTaxe}
                  precision={0}
                  valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
                  suffix="RON"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Procent Taxe"
                  value={procentTaxePfa}
                  precision={1}
                  valueStyle={{ color: "#faad14", fontWeight: 600 }}
                  prefix={<PercentageOutlined />}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* SRL Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BankOutlined />
                <span>SRL</span>
                <Tag color="purple">Societate cu Răspundere Limitată</Tag>
              </Space>
            }
            style={{ height: "100%" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Dividende Nete"
                  value={rezultateSrl.divdendeNete}
                  precision={0}
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                  prefix={<DollarOutlined />}
                  suffix="RON"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Profit Rămas în Firmă"
                  value={rezultateSrl.venitNetDupaTaxe}
                  precision={0}
                  valueStyle={{
                    color: "#1677ff",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                  suffix="RON"
                />
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Detalii Taxe</Title>

            <Flex vertical gap={12}>
              <Flex justify="space-between">
                <Text type="secondary">Impozit Profit (16%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultateSrl.impozitProfitDatorat.toLocaleString("ro-RO")}{" "}
                  RON
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">Impozit Dividende (16%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultateSrl.impozitDividendeDatorat.toLocaleString(
                    "ro-RO"
                  )}{" "}
                  RON
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text type="secondary">CASS (sănătate - 10%)</Text>
                <Text strong style={{ color: "#ff7875" }}>
                  {rezultateSrl.cassDatorat.toLocaleString("ro-RO")} RON
                </Text>
              </Flex>
            </Flex>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Total Taxe"
                  value={rezultateSrl.totalTaxe}
                  precision={0}
                  valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
                  suffix="RON"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Procent Taxe"
                  value={procentTaxeSrl}
                  precision={1}
                  valueStyle={{ color: "#faad14", fontWeight: 600 }}
                  prefix={<PercentageOutlined />}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Flex justify="center">
        <Text type="secondary">
          Calcule bazate pe legislația fiscală 2024 • Salariu minim brut:
          4.050 RON
        </Text>
      </Flex>
    </Flex>
  );
}

