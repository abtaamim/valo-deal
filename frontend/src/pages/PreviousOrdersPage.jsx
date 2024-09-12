import React from "react";
import { useState, useEffect } from "react";
import { Typography } from "antd";
import axios from "axios";

const PreviousOrders = () => {

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://valo-deal-backend.vercel.app/order/boughtItem');
        setOrders(res.data.items);
      }
      catch (error) {
        console.error(error)
      }
    }
    fetchOrders();
  }, [])
  return (
    <>
      {
        orders?.map(order => (
          <>
            <Typography>
              {`Price: ${order.price}`}
            </Typography>
            <Typography>
              {`Bought Date: ${order.boughtDate}`}
            </Typography>
            <Typography>
              {`Item Type: ${order.itemType}`}
            </Typography>
          </>
        ))
      }
    </>
  )
}

export default PreviousOrders;