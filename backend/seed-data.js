const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Clothing = require('./models/Clothing');

const sampleUsers = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Mike Davis',
    email: 'mike@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const sampleClothing = [
  {
    name: 'Winter Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1539533057440-7814bae90f60?w=400&h=400&fit=crop',
    weather: ['Cold']
  },
  {
    name: 'Summer T-Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    weather: ['Hot', 'Warm']
  },
  {
    name: 'Light Sweater',
    imageUrl: 'https://images.unsplash.com/photo-1556821552-5ff63b1b5786?w=400&h=400&fit=crop',
    weather: ['Warm', 'Cold']
  },
  {
    name: 'Shorts',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    weather: ['Hot', 'Warm']
  },
  {
    name: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
    weather: ['Warm', 'Cold']
  },
  {
    name: 'Rain Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop',
    weather: ['Cold']
  },
  {
    name: 'Casual Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1596399579883-e6a99efeae60?w=400&h=400&fit=crop',
    weather: ['Warm']
  },
  {
    name: 'Thermal Leggings',
    imageUrl: 'https://images.unsplash.com/photo-1506629082632-401017062e51?w=400&h=400&fit=crop',
    weather: ['Cold']
  },
  {
    name: 'Linen Dress',
    imageUrl: 'https://images.unsplash.com/photo-1595777707802-e176fc7f913f?w=400&h=400&fit=crop',
    weather: ['Hot']
  },
  {
    name: 'Wool Coat',
    imageUrl: 'https://images.unsplash.com/photo-1539533057440-7814bae90f60?w=400&h=400&fit=crop',
    weather: ['Cold']
  },
  {
    name: 'Polo Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1618183479302-1461fb917bed?w=400&h=400&fit=crop',
    weather: ['Warm']
  },
  {
    name: 'Denim Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
    weather: ['Warm', 'Cold']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wtwr', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Clothing.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create clothing items with random owners
    const clothingWithOwners = sampleClothing.map((item, index) => ({
      ...item,
      owner: createdUsers[index % createdUsers.length]._id,
      likes: []
    }));

    const createdClothing = await Clothing.create(clothingWithOwners);
    console.log(`Created ${createdClothing.length} clothing items`);

    // Add some likes
    if (createdClothing.length > 0 && createdUsers.length > 1) {
      createdClothing[0].likes.push(createdUsers[1]._id);
      createdClothing[1].likes.push(createdUsers[0]._id, createdUsers[2]._id);
      createdClothing[2].likes.push(createdUsers[1]._id);
      
      await createdClothing[0].save();
      await createdClothing[1].save();
      await createdClothing[2].save();
      console.log('Added sample likes');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    createdUsers.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.email} / password123`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
