import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Tag, Spin } from "antd";
import axios from "axios";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const { Text, Title } = Typography;

const PreviousSold = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get("/order/soldItem");
        setOrders(res.data.items);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosPrivate]);


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#232222" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px", marginTop: "1px", color: "#FF8C00" }}>
        Previously sold
      </Title>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {orders?.map((order) => (
            <Col xs={24} sm={12} md={8} lg={6} key={order._id}>
              <Card
                hoverable
                style={{
                  width: "100%",
                  height: "440px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#333",
                }}
                cover={
                  <div
                    style={{
                      height: "200px",
                      backgroundImage: `url(${order.imgUrl[1]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                }
              >

                <Title level={4} style={{ textAlign: "flex-start", color: "#fff", fontSize: "16px" }}>
                  {order.brand} {order.model}
                </Title>
                <Text
                  strong
                  style={{ display: "block", fontSize: "16px", marginBottom: "8px", color: "#ff6600" }}
                >
                  {`Price: ${formatPrice(order.price)}`}
                </Text>
                <Text
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "violet",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  {`Sold on: ${new Date(order.soldDate).toLocaleDateString()}`}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PreviousSold;
