import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import { Card, Typography } from "@mui/material";
const ShowDetailsPage =()=>{
  const [item, setItem]= useState({});
  const {itemType, itemId} = useParams();
  const fetchItem= async()=>{
    const res = await axios.get(`https://valo-deal-backend.vercel.app/details/${itemType}/${itemId}`)
    setItem(res.data);
  }
  useEffect(()=>{
    fetchItem();
  },[itemId, itemType])
  console.log(item);
  return(
    <Card>
    <Typography>
     brand: {item.brand}
    </Typography>
    <Typography>
     model: {item.model}
    </Typography>
    <Typography>
     price: {item.price}
    </Typography>
    <Typography>
     description: {item.description}
    </Typography>
    <Typography>
      condition: {item.condition}
    </Typography>
    {item.authenticity?<Typography>
      authenticity: {item.authenticity}
    </Typography>: null}
    {item.imgUrl?.map(url=>(
      <Card>
        <img src={url} alt="product" width="300" height="300" />
      </Card>
    ))}
    </Card>
  )
}
export default ShowDetailsPage