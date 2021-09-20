const Article = require('../models/article');
const Category = require('../models/category');
const UseCase = require('../models/useCase');

const async = require('async');

exports.home_page = function(req, res, next) {
  async.parallel({
    categories_count: function(callback) {
      Category.countDocuments({}, callback);
    }, 
    useCases_count: function(callback) {
      UseCase.countDocuments({}, callback);
    }, 
    articles_count: function(callback) {
      Article.countDocuments({}, callback);
    },
    last_article: function(callback) {
      Article.findOne().sort({createdAt: -1}).exec(callback);
    }
  }, function(err, data) {
    res.render('index', { data: data, error: err });
  })
};
