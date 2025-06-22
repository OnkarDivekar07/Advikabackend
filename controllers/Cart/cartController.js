const   cartService = require('../../services/Cart/cartService');
  
  // GET /cart
  const getCartController = async (req, res) => {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  };
  
const saveCart = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid cart data." });
    }

    await cartService.saveUserCart(userId, cartItems);
    res.status(200).json({ message: "Cart saved successfully." });
    
  } catch (error) {
    console.error("Error in saveCart controller:", error);
    res.status(500).json({ message: "Failed to save cart." });
  }
};

  
  // PUT /cart
  const updateCartItemController = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const updatedItem = await cartService.updateCartItem(userId, productId, quantity);
    res.json(updatedItem);
  };
  
  // DELETE /cart
  const removeFromCartController = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;
    await cartService.removeFromCart(userId, productId);
    res.json({ message: 'Item removed from cart' });
  };
  
  module.exports = {
    getCartController,
    saveCart,
    updateCartItemController,
    removeFromCartController
  };
  