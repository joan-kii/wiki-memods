const Article = require('../models/article');
const Category = require('../models/category');
const UseCase = require('../models/useCase');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list all Articles
exports.articles_list = function(req, res, next) {
  Article.find({}, 'title description createdAt updatedAt slug category useCase')
         .populate('category')
         .populate('useCase')
         .exec(function(err, result) {
            if (err) next(err);
            res.render('articles_list', {
              title: 'Articles',
              articles_list: result
              })
            })
};

// Display Article Detail
exports.article_detail = function(req, res, next) {
  Article.findOne({slug: req.params.slug }, 'slug sanitizedHtml createdAt updatedAt category useCase markdown')
         .populate('category')
         .populate('useCase')
         .exec(function(err, article) {
           if (err) return next(err);
          res.render('article_detail', { article: article });
         });
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
      useCases_list: result.useCases_list,
      isUpdating: false,
      isAdmin: ''
      })
    }
  )
};

// Handle Article create form on POST
exports.article_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (req.body.category === 'undefined') {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.useCase instanceof Array)) {
      if (req.body.useCase === 'undefined') {
        req.body.useCase = [];
      } else {
        req.body.useCase = new Array(req.body.useCase);
      }
    }
    next();
  },
  body('category'),
  body('useCase'),
  body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
  body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
  body('markdown', 'Markdown must not be empty.').trim().isLength({min: 1}).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const article = new Article(
      {
        category: req.body.category,
        useCase: req.body.useCase,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
      }
    );
    if (!errors.isEmpty()) return next(err);
    article.save(function(err) {
      if (err) return next(err);
      res.redirect(article.slug);
    })
  }
];

// Display Article delete form on GET
exports.article_delete_get = function(req, res, next) {
  Article.findOne({ slug: req.params.slug}).exec(function(err, article) {
    if (err) return next(err);
    res.render('article_delete', {
      title: 'Delete Article: ',
      article: article,
      isAdmin: ''
    });
  })
};

// Handle Article delete form on POST
exports.article_delete_post = [
  body('password', 'Admin password required')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    if (!errors.isEmpty()) {
      Article.findOne({ slug: req.params.slug}).exec(function(err, article) {
        if (err) return next(err);
        res.render('article_delete', {
          title: 'Delete Article: ',
          article: article,
          isAdmin: ''
        })
      })
      return;
    } else if (!isAdmin) {
      Article.findOne({ slug: req.params.slug}).exec(function(err, article) {
        if (err) return next(err);
        res.render('article_delete', {
          title: 'Delete Article: ',
          article: article,
          isAdmin: 'Incorrect password. Try it again.'
        })
      })
      return;
    } else {
      Article.findOneAndRemove({slug: req.params.slug}, function(err) {
        if (err) return next(err);
        res.redirect('/articles');
      })
    }
  }
];

// Display Article update form on GET
exports.article_update_get = function(req, res, next) {
  async.parallel({
    article: function(callback) {
      Article.findOne({ slug: req.params.slug }).exec(callback);
    },
    category_list: function(callback) {
      Category.find().exec(callback);
    },
    useCases_list: function(callback) {
      UseCase.find().exec(callback);
    }
  }, function(err, result) {
    if (err) return next(err);
    res.render('article_form', { 
      title: 'Update Article',
      article: result.article,
      category_list: result.category_list,
      useCases_list: result.useCases_list,
      errors: result.err,
      isUpdating: true,
      isAdmin: '',
      })
    }
  )
};

// Handle Article update form on POST
exports.article_update_post = [
  body('category'),
  body('useCase'),
  body('title', 'Title must not be empty.').trim().isLength({min: 1}).escape(),
  body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
  body('markdown', 'Markdown must not be empty.').trim().isLength({min: 1}).escape(),
  body('password', 'Admin password required').trim().isLength({min: 1}).escape(),
  (req, res, next) => {
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    if (!isAdmin) {
      let err = new Error("The password you entered is incorrect.");
      err.status = 401;
      res.render('error', {error: err, message: 'The password you entered is incorrect.'});
      return;
    } else {
      const errors = validationResult(req);
      const article = {
        category: req.body.category,
        useCase: req.body.useCase,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        updatedAt: Date.now()
      };
      if (!errors.isEmpty()) {
        res.render('article_form', {
          title: 'Update Article',
          article: article,
          erros: errors.array()
        })
        return;
      } else {
        Article.findOneAndUpdate({slug: req.params.slug}, article, {}, function(err, article) {
          if (err) return next(err);
          res.redirect(`../${article.slug}`);
        })
      }
    }
  }
];
