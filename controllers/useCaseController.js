const UseCase = require('../models/useCase');
const Article = require('../models/article');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list all Use Cases
exports.useCases_list = function (req, res, next) {
  UseCase.find().exec(function(err, result) {
    if (err) return next(err);
    res.render('useCases_list', { 
      title: 'Use Cases', 
      useCases_list: result 
    });
  })
};

// Display use Case Detail
exports.useCase_detail = function(req, res, next) {
  async.autoInject({
    useCase: function(callback) {
      UseCase.findOne({slug: req.params.slug}, 'name description slug')
             .exec(callback);
    },
    article_list: function(useCase, callback) {
      Article.find({useCase: useCase._id}, 'title slug').exec(callback);
    }
  }, function(err, result) {
    if (err) return next(err);
    res.render('useCase_detail', { 
      useCase: result.useCase, 
      articles: result.article_list
    });
  })
};

// Display use Case create form on GET
exports.useCase_create_get = function(req, res, next) {
  res.render('useCase_form', {
    title: 'Create a new Use Case', 
    useCase: undefined,
    errors: undefined,
    isUpdating: false,
    isAdmin: ''
  });
};

// Handle use Case create form on POST
exports.useCase_create_post = [
  body('name', 'Use Case required')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'A brief explanation is required')
    .trim()
    .isLength({min: 10})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const useCase = new UseCase({
      name: req.body.name,
      description: req.body.description
    });
    if (!errors.isEmpty()) {
      res.render('useCase_form', {
        title: 'An error occurred while creating a new use case',
        useCase: useCase,
        errors: errors.array()
      });
    } else {
      UseCase.findOne({name: req.body.name, description: req.body.description})
        .exec(function(err, found_useCase) {
          if (err) return next(err);
          if (found_useCase) {
            res.redirect(found_useCase.slug);
          } else {
            useCase.save(function(err){
              if (err) return next(err);
              res.redirect(useCase.slug);
            })
          }
      })
    }
  }
];

// Display use Case delete form on GET
exports.useCase_delete_get = function(req, res, next) {
  UseCase.findOne({ slug: req.params.slug}).exec(function(err, useCase) {
    if (err) return next(err);
    res.render('useCase_delete', {
      title: 'Delete Use Case: ',
      useCase: useCase,
      isAdmin: ''
    });
  })
};

// Handle use Case delete form on POST
exports.useCase_delete_post = [
  body('password', 'Admin password required')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    if (!errors.isEmpty()) {
      UseCase.findOne({ slug: req.params.slug}).exec(function(err, useCase) {
        if (err) return next(err);
        res.render('seCase_delete', {
          title: 'Delete Use Case: ',
          useCase: useCase,
          isAdmin: ''
        })
      })
      return;
    } else if (!isAdmin) {
      UseCase.findOne({ slug: req.params.slug}).exec(function(err, useCase) {
        if (err) return next(err);
        res.render('useCase_delete', {
          title: 'Delete Use Case: ',
          useCase: useCase,
          isAdmin: 'Incorrect password. Try it again.'
        })
      })
      return;
    } else {
      UseCase.findOneAndRemove({slug: req.params.slug}, function(err) {
        if (err) return next(err);
        res.redirect('/use-cases');
      })
    }
  }
];

// Display use Case update form on GET
exports.useCase_update_get = function(req, res, next) {
  UseCase.findOne({ slug: req.params.slug }).exec(function(err, useCase) {
    if (err) return next(err);
    res.render('useCase_form', { 
      title: 'Update Use Case',
      useCase: useCase,
      isUpdating: true,
      errors: err,
      isAdmin: '',
    });
  })
};

// Handle use Case update form on POST
exports.useCase_update_post = [
  body('name', 'Use Case name required')
      .trim()
      .isLength({min: 1})
      .escape(),
  body('description', 'A brief use case description is required')
      .trim()
      .isLength({min: 30})
      .escape(),
  body('password', 'Admin password required')
      .trim()
      .isLength({min: 1})
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.body.password === process.env.ADMIN_PASSWORD;
    const useCase = {
      name: req.body.name,
      description: req.body.description
    };
    if (!errors.isEmpty()) {
      res.render('useCase_form', {
        title: 'Update Use Case',
        useCase: useCase,
        isUpdating: true,
        isAdmin: '',
        errors: errors.array()
      })
      return;
    } else if (!isAdmin) {
      res.render('useCase_form', {
        title: 'Update Use Case',
        useCase: useCase,
        isUpdating: true,
        errors: errors.array(),
        isAdmin: 'Incorrect password. Try it again.'
      })
      return;
    } else {
      UseCase.findOneAndUpdate({slug: req.params.slug}, useCase, {}, function(err, useCase) {
        if (err) return next(err);
        res.redirect(`../${useCase.slug}`);
      })
    }
  }
];
