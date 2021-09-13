const Article = require('../models/article');
const Category = require('../models/category');
const USeCase = require('../models/useCase');

const async = require('async');

// Display list all Articles
exports.articles_list = function(req, res, next) {
  async.parallel({
    articles_count: function(callback) {
      Article.countDocuments({}, callback);
    },
    categories_count: function(callback) {
      Category.countDocuments({}, callback);
    },
    useCases_count: function(callback) {
      USeCase.countDocuments({}, callback);
    },
    function(err, results) {
      res.render('index', {error: err, data: results});
    }
  })
};

// Display Article Detail
exports.article_detail = function(req, res, next) {
  res.send('nothing here yet');
};

// Display Article create form on GET
exports.article_create_get = function(req, res, next) {
  res.send('nothing here yet');
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
