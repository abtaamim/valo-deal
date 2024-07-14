import React from 'react';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Sample product data
const products = [
  { id: 1, name: 'Casio G-Shock', price: 1500, img: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Seiko Prospex', price: 2000, img: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Rolex Submariner', price: 4999, img: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Casio Whiz', price: 3570, img: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Apple Watches', price: 42000, img: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Omega Seamaster', price: 7500, img: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Cartier Tank', price: 9999, img: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Tissot Le Locle', price: 15000, img: 'https://via.placeholder.com/150' },
  { id: 9, name: 'Citizen Eco-Drive', price: 27800, img: 'https://via.placeholder.com/150' },
  { id: 10, name: 'Colmi P8 Pro', price: 1500, img: 'https://via.placeholder.com/150' },
  { id: 11, name: 'Oris Aquis', price: 18000, img: 'https://via.placeholder.com/150' },
  { id: 12, name: 'Bulgari Octo', price: 21000, img: 'https://via.placeholder.com/150' },
];

const HomePage = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Container className="container-custom" style={{ flex: '3 0 auto' }}>
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1200x500"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>We Provide Authentic Products</h3>
              <Button variant="light">View Products</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1200x500"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Choose Your Own Watch</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
      <Container className="container-custom" style={{ flex: '2 0 auto', padding: '20px' }}>
        <h2>Choose your own watch!</h2>
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <div className="card">
                <img src={product.img} alt={product.name} />
                <h4>{product.name}</h4>
                <p>Price: {product.price} BDT</p>
                <Button as={Link} to={`/product/${product.id}`} variant="primary">View Details</Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
