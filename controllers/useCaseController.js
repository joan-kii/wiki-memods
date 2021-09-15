const UseCase = require('../models/useCase');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list all Use Cases
exports.useCases_list = function(req, res, next) {
  res.send('nothing here yet');
};

// Display use Case Detail
exports.useCase_detail = function(req, res, next) {
  res.send('nothing here yet');
};

// Display use Case create form on GET
exports.useCase_create_get = function(req, res, next) {
  res.render('useCase_form', {
    title: 'Create a new Use Case', 
    useCase: undefined,
    errors: undefined
  })
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
  res.send('nothing here yet');
};

// Handle use Case delete form on POST
exports.useCase_delete_post = function(req, res, next) {
  res.send('nothing here yet');
};
// Display use Case update form on GET
exports.useCase_update_get = function(req, res, next) {
  res.send('nothing here yet');
};

// Handle use Case update form on POST
exports.useCase_update_post = function(req, res, next) {
  res.send('nothing here yet');
};
