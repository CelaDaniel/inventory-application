#! /usr/bin/env node
require('dotenv').config();

const Category = require('./models/category');
const Item = require('./models/item');

const category = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Debug: MongoDB connected');

  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const categoryDetail = new Category({ name, description });
  await categoryDetail.save();
  category[index] = categoryDetail;
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, category, price, stock) {
  const item = new Item({ name, description, category, price, stock });
  await item.save();
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  try {
    await mongoose.connection.db.dropCollection('categories');
  } catch (error) {
    console.error(`Failed to drop 'categories' collection: ${error}`);
  }
  console.log('Adding categories');
  await categoryCreate(0, 'Milk', 'Freshly local produced milk');
  await categoryCreate(1, 'Tee', 'High quality british tee');
  await categoryCreate(2, 'Beer', 'International beer');
}

async function createItems() {
  try {
    await mongoose.connection.db.dropCollection('items');
  } catch (error) {
    console.error(`Failed to drop 'items' collection: ${error}`);
  }
  console.log('Adding items');
  await itemCreate('Whole Milk', 'Fresh whole milk', category[0], 2.5, 100);
  await itemCreate('Semi-Skimmed Milk', 'Fresh semi-skimmed milk', category[0], 2.5, 100);
  await itemCreate('Skimmed Milk', 'Fresh skimmed milk', category[0], 2.5, 100);
  await itemCreate('Green Tee', 'High quality green tee', category[1], 3.5, 50);
  await itemCreate('Black Tee', 'High quality black tee', category[1], 3.5, 50);
  await itemCreate('Spekulatius Tee', 'High quality spekulatius tee', category[1], 3.5, 50);
  await itemCreate('Heineken', 'International beer', category[2], 2.5, 100);
  await itemCreate('Guinness', 'International beer', category[2], 2.5, 100);
  await itemCreate('Corona', 'International beer', category[2], 2.5, 100);
}
