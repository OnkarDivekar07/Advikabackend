const productService = require('../../services/Product/productServices');
const awsService = require('../../utils/AWSUploads');
const CustomError = require('../../utils/customError');

exports.getAllProducts = async (req, res,next) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error)
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error)
  }
};

exports.createProduct = async (req, res, next) => {
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
      throw new CustomError('Missing required fields',404);
    }

    if (!images || images.length === 0) {
      throw new CustomError('No images uploaded');
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


    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error)
  }
};


exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

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
    next(error)
  }
};


exports.deleteProduct = async (req, res,   next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      throw new CustomError('Product not found',404);
    }

    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error)
  }
};

exports.getRelatedProducts = async (req, res,next) => {
  const { id } = req.params;

  try {
    const related = await productService.getRelatedProducts(id);
    res.json(related);
  } catch (error) {
   next(error)
  }
};