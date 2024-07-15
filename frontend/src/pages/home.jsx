import React, { useState } from 'react';
import { Carousel, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles.css';
import slider1 from '../assests/slider1.jpg';
import slider2 from '../assests/slider2.jpg';
import slider3 from '../assests/slider3.jpg';
import SearchBar from '../siteComponents/searchbar.jsx';

const products = [
  { id: 1, name: 'Iphone 15 Pro', price: 1500, img: 'https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-15-Plus-(2)-(1)-6945.jpg' },
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
  { id: 16, name: 'Iphone 15 Pro Max', price: 21000, img: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT233?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693248327138' },
];

const HomePage = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (query) => {
    if (query === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ));
    }
  };

  return (
    <div style={{ height: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SearchBar onSearch={handleSearch} />
      <Container className="container-custom" style={{ flex: '3 0 auto', paddingTop: '20px' }}>
        <div className="d-flex flex-wrap justify-content-center mb-4">
          <Button variant="success" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Mobile</Button>
          <Button variant="secondary" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Computer</Button>
          <Button variant="danger" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Watch</Button>
          <Button variant="outline-danger" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Accessories</Button>
          <Button variant="warning" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Tablets</Button>
          <Button variant="info" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Headphones</Button>
          <Button variant="outline-dark" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Cameras</Button>
          <Button variant="dark" className="mx-2 mb-2" style={{ minWidth: '120px' }}>Drones</Button>
        </div>
        <Carousel style={{ height: '300px' }}>
          <Carousel.Item>
            <img className="d-block w-100" src={slider1} alt="First slide" />
            <Carousel.Caption>
              <Button variant="light">View Products</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={slider2} alt="Second slide" />
            <Carousel.Caption>
              <Button variant="light">View Products</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={slider3} alt="Third slide" />
            <Carousel.Caption>
              <Button variant="light">View Products</Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
      <Container className="container-custom" style={{ flex: '2 0 auto', padding: '20px' }}>
        <h2>Choose your own watch!</h2>

        <Row>
          {filteredProducts.slice(0, 4).map((product) => (
            <Col key={product.id} xs={12} sm={6} md={3} className="mb-4">
              <Card className="text-center">
                <Card.Img variant="top" src={product.img} alt={product.name} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: {product.price} BDT</Card.Text>
                  <Button as={Link} to={`/product/${product.id}`} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {filteredProducts.slice(4, 8).map((product) => (
            <Col key={product.id} xs={12} md={6} className="mb-4">
              <Card className="d-flex flex-row align-items-center">
                <Card.Img variant="left" src={product.img} style={{ width: '150px' }} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: {product.price} BDT</Card.Text>
                  <Button as={Link} to={`/product/${product.id}`} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {filteredProducts.slice(8, 14).map((product) => (
            <Col key={product.id} xs={12} sm={6} md={2} className="mb-4">
              <Card className="text-center">
                <Card.Img variant="top" src={product.img} alt={product.name} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: {product.price} BDT</Card.Text>
                  <Button as={Link} to={`/product/${product.id}`} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
