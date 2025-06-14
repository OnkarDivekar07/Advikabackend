const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
  } = require('../../services/Cart/cartService');
  
  // GET /cart
  const getCartController = async (req, res) => {
    const userId = req.user.userId;
    const cart = await getCart(userId);
    res.json(cart);
  };
  
  // POST /cart
  const addToCartController = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const cartItem = await addToCart(userId, productId, quantity);
    res.status(201).json(cartItem);
  };
  
  // PUT /cart
  const updateCartItemController = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const updatedItem = await updateCartItem(userId, productId, quantity);
    res.json(updatedItem);
  };
  
  // DELETE /cart
  const removeFromCartController = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;
    await removeFromCart(userId, productId);
    res.json({ message: 'Item removed from cart' });
  };
  
  module.exports = {
    getCartController,
    addToCartController,
    updateCartItemController,
    removeFromCartController
  };
  