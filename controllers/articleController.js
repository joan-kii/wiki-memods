const Article = require('../models/article');
const Category = require('../models/category');
const UseCase = require('../models/useCase');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list all Articles
exports.articles_list = function(req, res, next) {
  res.send('nothing here yet');
};

// Display Article Detail
exports.article_detail = function(req, res, next) {
  res.send('nothing here yet');
};

// Display Article create form on GET
exports.article_create_get = function(req, res, next) {
  async.parallel({
    category_list: function(callback) {
      Category.find().exec(callback);
    },
    useCases_list: function(callback) {
      UseCase.find().exec(callback);
    }
  }, function(err, result) {
    if (err) return next(err);
    res.render('article_form', {
      title: 'New article',
      article: undefined,
      errors: undefined,
      category_list: result.category_list,
      useCases_list: result.useCases_list
      })
    }
  )
};

// Handle Article create form on POST
exports.article_create_post = function(req, res, next) {
  res.send('nothing here yet');
};

// Display Article delete form on GET
exports.article_delete_get = function(req, res, next) {
  res.send('nothing here yet');
};

// Handle Article delete form on POST
exports.article_delete_post = function(req, res, next) {
  res.send('nothing here yet');
};
// Display Article update form on GET
exports.article_update_get = function(req, res, next) {
  res.send('nothing here yet');
};

// Handle Article update form on POST
exports.article_update_post = function(req, res, next) {
  res.send('nothing here yet');
};
