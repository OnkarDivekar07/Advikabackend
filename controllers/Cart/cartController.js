const   cartService = require('../../services/Cart/cartService');
const CustomError=require('../../utils/customError')  
  // GET /cart
  const getCartController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

  
const saveCart = async (req, res, next) => {
  try {
    const userId = req.user.userId; // from JWT
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
     throw new CustomError(400, 'Invalid cart data.');
    }

    await cartService.saveUserCart(userId, cartItems);
    res.status(200).json({ message: "Cart saved successfully." });
    
  } catch (error) {
    next(error)
  }
};

  
  // PUT /cart
  const updateCartItemController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const updatedItem = await cartService.updateCartItem(userId, productId, quantity);

    res.json(updatedItem);
  } catch (error) {
    next(error); // Forward the error to the custom error middleware
  }
};

  
  // DELETE /cart
  const removeFromCartController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    await cartService.removeFromCart(userId, productId);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error); // Forward to custom error handler middleware
  }
};

  
  module.exports = {
    getCartController,
    saveCart,
    updateCartItemController,
    removeFromCartController
  };
  