import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Tooltip, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListingCard = (props) => {

  const items = props.items;
  const handleClickOpen = props.handleClickOpen;
  const button= props.button
  console.log('item>>>',props)

  const navigate = useNavigate();
  const handleRecentlyView= async(itemType, itemId)=>{
    try{
      await axios.post(`https://valo-deal-backend.vercel.app/recentlyViewed/${itemType}/${itemId}`);
    }catch(e){
      console.error(`Error viewing item:`, e);
    }finally{
      navigate(`/details/${itemType}/${itemId}`)
    }
    
  }
  return (
    
      <Grid container spacing={2} sx={{ flexWrap: 'wrap', gap: 0, ml: '20px' }}>
        {items.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={3} lg={3} >
            <Card sx={{ width: '300px' }}>
              <CardMedia
                component="img"
                height="240"
                image={item.imgUrl}
                alt={`${item.brand} ${item.model}`}
                src={item.imgUrl}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <Typography gutterBottom variant="h5" component="div">
                  {item.brand} {item.model}
                </Typography>
               
               { item.conditon? (<Typography variant="body2" color="text.secondary">
                  Condition: {item.condition}
                </Typography>): (null)}
                <Typography variant="body2" color="text.secondary">
                  {item.authenticity ? `Authenticity: ${item.authenticity}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {item.description}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography> */}
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <Button size="small" onClick={()=>{handleRecentlyView(item.itemType, item._id)}}>View Details</Button>

                <IconButton onClick={() => handleClickOpen(item._id, item.itemType)}>
                  {/* <RemoveShoppingCartOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} /> */}
                {button}
                </IconButton>

              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
}
export default ListingCard;