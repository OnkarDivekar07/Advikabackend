const productService = require('../../services/Product/productServices');
const awsService = require('../../utils/AWSUploads');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const images = req.files;
    const {
      name,
      category,
      brand,
      price,
      stock,
      description,
      isNewArrival,
    } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Upload images to S3 and collect URLs
    const uploadedImageUrls = await Promise.all(
      images.map((image) =>
        awsService.uploadToS3(
          image.buffer,
          `product-images/${Date.now()}_${image.originalname}`
        )
      )
    );

    // Build the product data
    const productData = {
      name,
      category,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      isNewArrival: isNewArrival === 'true', // checkbox comes as string
      images: uploadedImageUrls,
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
