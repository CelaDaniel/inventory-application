const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 100 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
