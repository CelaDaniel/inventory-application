const Item = require('../models/item');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name').exec();
  res.render('item_list', { title: 'Item List', item_list: allItems });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();
  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }
  res.render('item_detail', { item: item });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec();
  res.render('item_form', { title: 'Create Item', categories: categories });
});

// Handle Item create on POST.
exports.item_create_post = [
  // Validate and sanitize fields.
  body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Item description required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Item price required').trim().isLength({ min: 1 }).escape(),
  body('stock', 'Item stock required').trim().isLength({ min: 1 }).escape(),
  body('category.*').escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create an item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      const categories = await Category.find({}).exec();
      // There are errors. Render form again with sanitized values/error messages.
      res.render('item_form', {
        title: 'Create Item',
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete GET');
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete POST');
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update GET');
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update POST');
});
