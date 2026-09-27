const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Set up PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('MasterMarketer engine running live on Railway with Prisma 7!');
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const newItem = await prisma.item.create({
      data: { title, description, price: parseFloat(price) || 0 }
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
