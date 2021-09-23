const Category = require('../models/category');
const Article = require('../models/article');

const mongoose = require('mongoose');
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
    errors: undefined
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
      .isLength({min: 30})
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
        errors: errors.array()
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
  res.send('nothing here yet');
};

// Handle category delete form on POST
exports.category_delete_post = function(req, res, next) {
  res.send('nothing here yet');
};
// Display category update form on GET
exports.category_update_get = function(req, res, next) {
  Category.findOne({ slug: req.params.slug }).exec(function(err, category) {
    if (err) return next(err);
    res.render('category_form', { 
      title: 'Update Category',
      category: category,
      errors: err
    })
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
      .isLength({min: 30})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = {
      name: req.body.name,
      description: req.body.description
    };
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update Category',
        erros: errors.array()
      })
      return;
    } else {
      Category.findOneAndUpdate({slug: req.params.slug}, category, {}, function(err, category) {
        if (err) return next(err);
        console.log(category.slug)
        res.redirect(`../${category.slug}`);
      })
    }
  }
];
