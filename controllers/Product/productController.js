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
    console.log(req.params.id)
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const images = req.files;
     
    // Extract category separately so we can transform it
    let {
      name,
      category,
      brand,
      price,
      stock,
      description,
      isNewArrival,
    } = req.body;

    // Force category into an array (e.g., ["Truck", "Tempo"])
    if (!Array.isArray(category)) {
      category = category ? [category] : [];
    }

    // Basic field validation
    if (!name || !price || !stock || !description || category.length === 0 || !brand) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedImageUrls = await Promise.all(
      images.map((image) =>
        awsService.uploadToS3(
          image.buffer,
          `product-images/${Date.now()}_${image.originalname}`
        )
      )
    );

    const productData = {
      name,
      category,
      brand,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      isNewArrival: isNewArrival === 'true',
      images: uploadedImageUrls,
    };

    console.log('🛠 Creating product with data:', productData);

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Product creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);

    // Extract fields from form data
    const { name, category, price, description, stock, brand, isNewArrival } = req.body;

    // Handle image files
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    // Prepare update data
    const updateData = {
      name,
      category, // array supported if Prisma allows it
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      brand,
      isNewArrival: isNewArrival === 'true'
    };

    // Only update images if new ones are provided
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
    }

    const updatedProduct = await productService.updateProduct(id, updateData);

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update failed:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const related = await productService.getRelatedProducts(id);
    res.json(related);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};