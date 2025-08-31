const mongoose = require("mongoose")
const ProductCategory = require("../models/ProductCategory");
const dotenv = require('dotenv');
dotenv.config()
async function seedCategories() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    const existing = await ProductCategory.countDocuments();
    if (existing > 0) {
      console.log('Categories already exist. Skipping seeding.');
      return process.exit(0);
    }

    const topCategories = await ProductCategory.insertMany([
      { name: 'Mobiles' },
      { name: 'Computers' },
      { name: 'Fashion' },
      { name: 'Home & Kitchen' },
      { name: 'Books' },
      { name: 'Beauty & Health' },
      { name: 'Sports & Outdoors' },
      { name: 'Toys & Games' },
      { name: 'Automotive' },
      { name: 'Grocery' }
    ]);

    const mobiles = topCategories.find(c => c.name === 'Mobiles');
    const computers = topCategories.find(c => c.name === 'Computers');

    await ProductCategory.insertMany([
      { name: 'Smartphones', parent_id: mobiles._id },
      { name: 'Feature Phones', parent_id: mobiles._id },
      { name: 'Phone Accessories', parent_id: mobiles._id },
      { name: 'Laptops', parent_id: computers._id },
      { name: 'Desktops', parent_id: computers._id },
      { name: 'Computer Accessories', parent_id: computers._id },
      { name: 'Data Storage', parent_id: computers._id },
      { name: 'Monitor', parent_id: computers._id },
      { name: 'Networking Products', parent_id: computers._id },
      { name: 'External Components', parent_id: computers._id },
    ]);

    console.log('Categories seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(' Seeding error:', err);
    process.exit(1);
  }
}

seedCategories();