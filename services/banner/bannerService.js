const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError=require('../../utils/customError')


// Fetch latest banner
const getLatestBanner =  async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
       take: 3,
    });
    return  banners
  } catch (error) {
   throw new CustomError('No banners found', 404); 
  }
};

// Create new banner
const createNewBanner = async (imageUrl, linkUrl) => {
  return await prisma.banner.create({
    data: { imageUrl, linkUrl },
  });
  
};


const getNewArrivals = async () => {
  return await prisma.product.findMany({
    where: {
  isNewArrival: true,
},
    orderBy: {
      createdAt: 'desc', // Optional: show latest first
    },
  });
};

const softDeleteNewArrivalService = async (id) => {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { isNewArrival: false },
  });
  return updatedProduct;
};

const getBannerById = async (id) => {
  return await prisma.banner.findUnique({
    where: { id },
  });
};


const deleteBannerById = async (id) => {
  return await prisma.banner.delete({
    where: { id },
  });
};



module.exports = {
  getLatestBanner,
  createNewBanner,
  deleteBannerById,
  getBannerById,
  softDeleteNewArrivalService,
  getNewArrivals
};