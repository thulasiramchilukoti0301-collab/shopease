require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // ELECTRONICS
  {
    name: 'iPad Pro 12.9 M2',
    description: 'Apple iPad Pro with M2 chip, Liquid Retina XDR display, perfect for creative professionals',
    price: 89999, originalPrice: 109999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    stock: 25, brand: 'Apple', featured: true, tags: ['ipad', 'apple', 'tablet']
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Premium Windows laptop with Intel Core i7, 16GB RAM, 512GB SSD and OLED display',
    price: 129999, originalPrice: 149999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500',
    stock: 15, brand: 'Dell', featured: false, tags: ['dell', 'laptop', 'windows']
  },
  {
    name: 'Canon EOS R50 Camera',
    description: 'Mirrorless camera with 24.2MP sensor, perfect for photography beginners and enthusiasts',
    price: 69999, originalPrice: 84999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    stock: 20, brand: 'Canon', featured: true, tags: ['canon', 'camera', 'photography']
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with health monitoring, GPS, and always-on Retina display',
    price: 41999, originalPrice: 49999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500',
    stock: 40, brand: 'Apple', featured: true, tags: ['apple', 'watch', 'smartwatch']
  },
  {
    name: 'JBL Flip 6 Speaker',
    description: 'Portable waterproof Bluetooth speaker with powerful sound and 12 hours battery life',
    price: 9999, originalPrice: 13999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stock: 60, brand: 'JBL', featured: false, tags: ['jbl', 'speaker', 'bluetooth']
  },
  {
    name: 'LG 4K OLED TV 55"',
    description: 'Stunning 55 inch 4K OLED TV with Dolby Vision, HDR10 and webOS smart platform',
    price: 89999, originalPrice: 119999, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    stock: 10, brand: 'LG', featured: true, tags: ['lg', 'tv', 'oled', '4k']
  },

  // FASHION
  {
    name: 'Adidas Ultraboost 22',
    description: 'High performance running shoes with Boost cushioning technology for ultimate comfort',
    price: 12999, originalPrice: 17999, category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=500',
    stock: 45, brand: 'Adidas', featured: true, tags: ['adidas', 'shoes', 'running']
  },
  {
    name: 'Zara Floral Dress',
    description: 'Elegant floral print midi dress perfect for casual outings and special occasions',
    price: 3499, originalPrice: 5999, category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
    stock: 70, brand: 'Zara', featured: false, tags: ['zara', 'dress', 'women']
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    description: 'Classic aviator sunglasses with UV400 protection and premium metal frame',
    price: 8999, originalPrice: 12999, category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    stock: 55, brand: 'Ray-Ban', featured: false, tags: ['rayban', 'sunglasses', 'accessories']
  },
  {
    name: 'Tommy Hilfiger Backpack',
    description: 'Premium quality backpack with multiple compartments, perfect for college and travel',
    price: 4999, originalPrice: 7999, category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stock: 35, brand: 'Tommy Hilfiger', featured: false, tags: ['tommy', 'backpack', 'bag']
  },

  // BOOKS
  {
    name: 'The Psychology of Money',
    description: 'Morgan Housel explores the strange ways people think about money in this must-read book',
    price: 349, originalPrice: 599, category: 'Books',
    image: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=500',
    stock: 200, brand: 'Harriman House', featured: true, tags: ['books', 'finance', 'money']
  },
  {
    name: 'Think and Grow Rich',
    description: 'Napoleon Hills classic masterpiece on achieving success and building wealth through mindset',
    price: 249, originalPrice: 499, category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    stock: 180, brand: 'Fingerprint', featured: false, tags: ['books', 'success', 'mindset']
  },
  {
    name: 'Deep Work by Cal Newport',
    description: 'Rules for focused success in a distracted world. Essential reading for productivity',
    price: 399, originalPrice: 699, category: 'Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',
    stock: 150, brand: 'Grand Central', featured: false, tags: ['books', 'productivity', 'focus']
  },

  // HOME & KITCHEN
  {
    name: 'Dyson V12 Vacuum Cleaner',
    description: 'Powerful cordless vacuum cleaner with laser dust detection and 60 min battery life',
    price: 49999, originalPrice: 64999, category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 15, brand: 'Dyson', featured: true, tags: ['dyson', 'vacuum', 'cleaning']
  },
  {
    name: 'Nespresso Coffee Machine',
    description: 'Premium pod coffee machine that brews cafe quality espresso at home in seconds',
    price: 14999, originalPrice: 19999, category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    stock: 30, brand: 'Nespresso', featured: true, tags: ['coffee', 'nespresso', 'kitchen']
  },
  {
    name: 'IKEA Study Desk',
    description: 'Minimalist white study desk with drawer storage, perfect for home office setup',
    price: 7999, originalPrice: 10999, category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500',
    stock: 20, brand: 'IKEA', featured: false, tags: ['ikea', 'desk', 'furniture']
  },
  {
    name: 'Bamboo Bed Sheet Set',
    description: 'Ultra soft 100% organic bamboo bed sheet set with pillowcases, cooling and breathable',
    price: 2999, originalPrice: 4999, category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    stock: 50, brand: 'Organic Homes', featured: false, tags: ['bedsheet', 'bamboo', 'bedroom']
  },

  // BEAUTY
  {
    name: 'MAC Lipstick Ruby Woo',
    description: 'Iconic MAC Ruby Woo matte lipstick, a timeless classic red that suits all skin tones',
    price: 1799, originalPrice: 2299, category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf9796?w=500',
    stock: 100, brand: 'MAC', featured: false, tags: ['mac', 'lipstick', 'makeup']
  },
  {
    name: 'Neutrogena Sunscreen SPF 50',
    description: 'Lightweight non-greasy sunscreen with broad spectrum SPF 50 protection for daily use',
    price: 599, originalPrice: 899, category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500',
    stock: 150, brand: 'Neutrogena', featured: false, tags: ['sunscreen', 'skincare', 'spf']
  },
  {
    name: 'Dyson Airwrap Hair Styler',
    description: 'Multi-styler that curls, waves, smooths and dries hair without extreme heat damage',
    price: 44999, originalPrice: 54999, category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500',
    stock: 20, brand: 'Dyson', featured: true, tags: ['dyson', 'hair', 'styler']
  },

  // GAMING
  {
    name: 'Nintendo Switch OLED',
    description: 'Hybrid gaming console with vibrant OLED screen, play at home or on the go',
    price: 29999, originalPrice: 34999, category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500',
    stock: 30, brand: 'Nintendo', featured: true, tags: ['nintendo', 'switch', 'gaming']
  },
  {
    name: 'Corsair Gaming Chair',
    description: 'Ergonomic gaming chair with lumbar support, adjustable armrests and reclining backrest',
    price: 24999, originalPrice: 34999, category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500',
    stock: 15, brand: 'Corsair', featured: false, tags: ['corsair', 'chair', 'gaming']
  },
  {
    name: 'SteelSeries Arctis 7 Headset',
    description: 'Wireless gaming headset with lossless 2.4GHz audio and 24 hour battery life',
    price: 14999, originalPrice: 19999, category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=500',
    stock: 40, brand: 'SteelSeries', featured: false, tags: ['steelseries', 'headset', 'gaming']
  },
  {
    name: 'ASUS ROG Gaming Monitor',
    description: '27 inch 165Hz QHD gaming monitor with 1ms response time and HDR support',
    price: 34999, originalPrice: 44999, category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    stock: 20, brand: 'ASUS', featured: true, tags: ['asus', 'monitor', 'gaming']
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected!');
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully!`);
    mongoose.connection.close();
  })
  .catch(err => console.log('Error:', err));