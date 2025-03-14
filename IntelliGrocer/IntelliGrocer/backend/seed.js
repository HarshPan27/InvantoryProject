require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");  // ✅ For dynamic pricing / sale items
const Inventory = require("./models/InventoryItem");  // ✅ For inventory

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Utility Functions
const getRandomSalesTrend = () => Math.floor(Math.random() * 100);
const getRandomStockLevel = () => Math.floor(Math.random() * 50) + 1;
const getRandomExpirationDate = () => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1));
};

// --- ✅ Seed Products for Dynamic Pricing ---
const seedProducts = async () => {
  await Product.deleteMany();

  const products = [
    {
      name: "Chocolate for Easter",
      basePrice: 2.5,
      image: "https://d3cif2hu95s88v.cloudfront.net/live-site-2016/product-image/IMG/16040616931_1-350x350.jpg",
      expirationDate: getRandomExpirationDate(),
      salesTrend: getRandomSalesTrend(),
      stockLevel: getRandomStockLevel(),
    },
    {
      name: "Electronics Sale",
      basePrice: 1.2,
      image: "https://ecelectronics.com/wp-content/uploads/2020/04/Modern-Electronics-EC-.jpg",
      expirationDate: getRandomExpirationDate(),
      salesTrend: getRandomSalesTrend(),
      stockLevel: getRandomStockLevel(),
    },
    {
      name: "Selected Grocery Sale",
      basePrice: 3.0,
      image: "https://media.self.com/photos/599c997a774b667d3bbe1214/4:3/w_1264,h_948,c_limit/groceries-family-month.jpg",
      expirationDate: getRandomExpirationDate(),
      salesTrend: getRandomSalesTrend(),
      stockLevel: getRandomStockLevel(),
    },
    {
      name: "Cosmetics Sale",
      basePrice: 5.0,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIz8BXfS5rSkLEtf7grCOqtmb-Olfs5sxhXA&s",
      expirationDate: getRandomExpirationDate(),
      salesTrend: getRandomSalesTrend(),
      stockLevel: getRandomStockLevel(),
    },
  ];

  await Product.insertMany(products);
  console.log("✅ Seeded Products (Featured Sales)!");
};

// --- ✅ Seed Inventory Data ---
const seedInventory = async () => {
  await Inventory.deleteMany();

  const inventoryItems = [
    {
      name: "Walnuts",
      description: "High-quality premium walnuts.",
      image: "https://i5.walmartimages.com/asr/29edd5be-63b4-46b4-a34f-429f5dd7758b.0958a87ddbc540acc1ba7e7c889df10d.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
      basePrice: 5.99,
      stockLevel: 40,
      salesTrend: getRandomSalesTrend(),
      expirationDate: getRandomExpirationDate(),
      category: "Nuts",
    },
    {
      name: "Milk",
      description: "Fresh and nutritious milk.",
      image: "https://assets.shop.loblaws.ca/products/20160571/b2/en/front/20160571_front_a06_@2.png",
      basePrice: 2.5,
      stockLevel: 100,
      salesTrend: getRandomSalesTrend(),
      expirationDate: getRandomExpirationDate(),
      category: "Dairy",
    },
    {
      name: "Cookie",
      description: "Bakery-style chocolate chip cookie.",
      image: "https://handletheheat.com/wp-content/uploads/2020/10/BAKERY-STYLE-CHOCOLATE-CHIP-COOKIES-9-637x637-1.jpg",
      basePrice: 1.99,
      stockLevel: 150,
      salesTrend: getRandomSalesTrend(),
      expirationDate: getRandomExpirationDate(),
      category: "Bakery",
    },
    {
      name: "Fresh Strawberries",
      description: "Juicy and sweet strawberries.",
      image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=350&q=80",
      basePrice: 3.99,
      stockLevel: 80,
      salesTrend: getRandomSalesTrend(),
      expirationDate: getRandomExpirationDate(),
      category: "Fruits",
    },
    {
      name: "Chips",
      description: "Crispy and delicious potato chips.",
      image: "https://i5.walmartimages.com/asr/13246f02-ee92-4407-8352-27572fadc812.086a180df04754bb6d44d604e0c289ed.jpeg",
      basePrice: 2.99,
      stockLevel: 120,
      salesTrend: getRandomSalesTrend(),
      expirationDate: getRandomExpirationDate(),
      category: "Snacks",
    },
  ];

  await Inventory.insertMany(inventoryItems);
  console.log("✅ Seeded Inventory Items!");
};

// --- ✅ Run Seeding ---
const seedDatabase = async () => {
  try {
    await seedProducts();
    await seedInventory();
    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();