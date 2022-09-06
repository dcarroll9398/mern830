import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';
import axios from 'axios';

export default function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry. Product out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img className="card-img-top" src={product.image} alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)} type="button">
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
