import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Tag, Spin } from "antd";
import axios from "axios";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const { Text, Title } = Typography;

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [sellerMap, setSellerMap] = useState({});
  const [loading, setLoading] = useState(true); 
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get("/order/boughtItem");
        setOrders(res.data.items);
        fetchSellers(res.data.items);
      } catch (error) {
        console.error(error);
        setLoading(false); 
      }
    };

    const fetchSellers = async (items) => {
      const sellerIds = [...new Set(items.map((item) => item.sellerId))];
      const sellersPromises = sellerIds.map((sellerId) =>
        axiosPrivate.get(`/api/v1/auth/seller-info/${sellerId}`)
      );

      try {
        const sellersResponses = await Promise.all(sellersPromises);
        const newSellerMap = {};
        sellersResponses.forEach((response) => {
          const seller = response.data.seller;
          newSellerMap[seller.sellerId] = seller.name;
        });
        setSellerMap(newSellerMap);
      } catch (error) {
        console.error("Error fetching seller info:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, [axiosPrivate]);

  return (
    <div style={{ padding: "30px", backgroundColor: "#232222" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px", marginTop: "1px", color: "#FF8C00" }}>
        My Orders
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
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <Tag color="blue" style={{ fontSize: "14px", padding: "5px 10px" }}>
                    {order.itemType}
                  </Tag>
                </div>
                <Title level={4} style={{ textAlign: "center", color: "#fff", fontSize: "16px" }}>
                  {order.brand} {order.model}
                </Title>
                <Text
                  strong
                  style={{ display: "block", fontSize: "16px", marginBottom: "8px", color: "#fff" }}
                >
                  {`Price: $${order.price}`}
                </Text>
                <Text
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#1890ff",
                    marginTop: "8px",
                  }}
                >
                  Buy from: {sellerMap[order.sellerId] || "Unknown"}
                </Text>
                <Text
                  style={{
                    display: "block",
                    fontSize: "14px",
                    color: "#ff6600",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  {`Bought on: ${new Date(order.boughtDate).toLocaleDateString()}`}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PreviousOrders;
