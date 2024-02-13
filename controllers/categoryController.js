const Category = require('../models/category');
const Item = require('../models/item');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display home page.
exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [numItems, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Inventory App - Home',
    item_count: numItems,
    category_count: numCategories,
  });
});

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();
  res.render('category_list', { title: 'Category List', category_list: allCategories });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description price stock').exec(),
  ]);
  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }
  res.render('category_detail', {
    title: 'Category Detail',
    category: category,
    category_items: itemsInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create Category' });
});

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Category description required').trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 }) // case-insensitive search
        .exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // Category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);
  if (category === null) {
    res.redirect('/categories');
  }
  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: itemsInCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);
  if (itemsInCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      category_items: itemsInCategory,
    });
    return;
  } else {
    // Category has no items. Delete object and redirect to the list of categories.
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }
  res.render('category_form', { title: 'Update Category', category: category });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Category description required').trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Category.findByIdAndUpdate(req.params.id, category).exec();
      // Category saved. Redirect to category detail page.
      res.redirect(category.url);
    }
  }),
];
