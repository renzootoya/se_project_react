const mongoose = require('mongoose');
require('dotenv').config();

const Clothing = require('./models/Clothing');

const sampleClothing = [
  {
    name: 'Winter Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1539533057440-7814bae90f60?w=400',
    weather: ['cold']
  },
  {
    name: 'Summer T-Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    weather: ['hot', 'warm']
  },
  {
    name: 'Light Sweater',
    imageUrl: 'https://images.unsplash.com/photo-1556821552-5ff63b1b5786?w=400',
    weather: ['warm', 'cold']
  },
  {
    name: 'Shorts',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    weather: ['hot', 'warm']
  },
  {
    name: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
    weather: ['warm', 'cold']
  },
  {
    name: 'Rain Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
    weather: ['cold']
  },
  {
    name: 'Casual Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1596399579883-e6a99efeae60?w=400',
    weather: ['warm']
  },
  {
    name: 'Thermal Leggings',
    imageUrl: 'https://images.unsplash.com/photo-1506629082632-401017062e51?w=400',
    weather: ['cold']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Clear existing clothing
    await Clothing.deleteMany({});
    console.log('Cleared existing clothing items');

    // Add sample clothing
    const result = await Clothing.insertMany(sampleClothing);
    console.log(`Added ${result.length} clothing items to database`);

    console.log('\nSample clothing items:');
    result.forEach(item => {
      console.log(`- ${item.name} (${item.weather.join(', ')})`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
