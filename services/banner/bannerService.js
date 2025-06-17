const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Fetch latest banner
const getLatestBanner =  async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
       take: 3,
    });
    return  banners
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching banners' });
  }
};

// Create new banner
const createNewBanner = async (imageUrl, linkUrl) => {
  console.log('i  am here')
  return await prisma.banner.create({
    data: { imageUrl, linkUrl },
  });
  
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
  getBannerById
};