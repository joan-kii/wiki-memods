const Category = require('../models/category');
const Article = require('../models/article');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list all categories
exports.categories_list = function(req, res, next) {
  Category.find().exec(function(err, result) {
    if (err) return next(err);
    res.render('category_list', {
      title: 'Categories',
      category_list: result
    })
  })
};

// Display category Detail
exports.category_detail = function(req, res, next) {
  async.autoInject({
    category: function(callback) {
      Category.findOne({slug: req.params.slug}, 'name description slug')
              .exec(callback);
    },
    article_list: function(category, callback) {
      Article.find({category: category._id}, 'title slug').exec(callback);
    }
  }, function(err, result) {
    if (err) return next(err);
    res.render('category_detail', { 
      category: result.category, 
      articles: result.article_list
    });
  })
};

// Display category create form on GET
exports.category_create_get = function(req, res, next) {
  res.render('category_form', {
    title: 'Create a new category', 
    category: undefined,
    errors: undefined,
    isUpdating: false,
    isAdmin: '',
  });
};

// Handle category create form on POST
exports.category_create_post = [
  body('name', 'Category name required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('description', 'A brief category description is required')
      .trim()
      .isLength({min: 3})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'An error occurred while creating a new category', 
        category: category, 
        isUpdating: true,
        isAdmin: '',
        errors: errors
      });
    } else {
      Category.findOne({ name: req.body.name, description: req.body.description})
        .exec(function(err, found_category) {
          if (err) return next(err);
          if (found_category) {
            res.redirect(found_category.slug);
          } else {
            category.save(function(err) {
            if (err) return next(err);
            res.redirect(category.slug);
          })
        }
      })
    }
  }
];

// Display category delete form on GET
exports.category_delete_get = function(req, res, next) {
  Category.findOne({ slug: req.params.slug}).exec(function(err, category) {
    if (err) return next(err);
    res.render('category_delete', {
      title: 'Delete Category: ',
      category: category,
      isAdmin: ''
    });
  })
};

// Handle category delete form on POST
exports.category_delete_post = [
  body('password', 'Admin password required')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    if (!errors.isEmpty()) {
      Category.findOne({ slug: req.params.slug}).exec(function(err, category) {
        if (err) return next(err);
        res.render('category_delete', {
          title: 'Delete Category: ',
          category: category,
          isAdmin: ''
        })
      })
      return;
    } else if (!isAdmin) {
      Category.findOne({ slug: req.params.slug}).exec(function(err, category) {
        if (err) return next(err);
        res.render('category_delete', {
          title: 'Delete Category: ',
          category: category,
          isAdmin: 'Incorrect password. Try it again.'
        })
      })
      return;
    } else {
      Category.findOneAndRemove({slug: req.params.slug}, function(err) {
        if (err) return next(err);
        res.redirect('/categories');
      })
    }
  }
];

// Display category update form on GET
exports.category_update_get = function(req, res, next) {
  Category.findOne({ slug: req.params.slug }).exec(function(err, category) {
    if (err) return next(err);
    res.render('category_form', { 
      title: 'Update Category',
      category: category,
      errors: err, 
      isUpdating: true,
      isAdmin: '',
    });
  })
};

// Handle category update form on POST
exports.category_update_post = [
  body('name', 'Category name required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('description', 'A brief category description is required')
      .trim()
      .isLength({min: 3})
      .escape(),
  body('password', 'Admin password required')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    const category = {
      name: req.body.name,
      description: req.body.description
    };
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update Category',
        category: category,
        isUpdating: true,
        isAdmin: '',
        errors: errors.array()
      })
      return;
    } else if (!isAdmin) {
      res.render('category_form', {
        title: 'Update Category',
        category: category,
        isUpdating: true,
        errors: errors.array(),
        isAdmin: 'Incorrect password. Try it again.'
      })
      return;
    } else {
      Category.findOneAndUpdate({slug: req.params.slug}, category, {}, function(err, category) {
        if (err) return next(err);
        res.redirect(`../${category.slug}`);
      })
    }
  }
];
