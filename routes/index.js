const express = require('express');
const router = express.Router();

const home_controller = require('../controllers/homeController');
const article_controller = require('../controllers/articleController');
const category_controller = require('../controllers/categoryController');
const useCase_controller = require('../controllers/useCaseController');

/* GET home page. */
router.get('/', home_controller.home_page);

// Article Routes
router.get('/articles/create', article_controller.article_create_get);
router.post('/articles/create', article_controller.article_create_post);
router.get('/articles/:slug/delete', article_controller.article_delete_get);
router.post('/articles/:slug/delete', article_controller.article_delete_post);
router.get('/articles/:slug/update', article_controller.article_update_get);
router.post('/articles/:slug/update', article_controller.article_update_post);
router.get('/articles/:slug', article_controller.article_detail);
router.get('/articles', article_controller.articles_list);

// Category Routes
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);
router.get('/category/:slug/delete', category_controller.category_delete_get);
router.post('/category/:slug/delete', category_controller.category_delete_post);
router.get('/category/:slug/update', category_controller.category_update_get);
router.post('/category/:slug/update', category_controller.category_update_post);
router.get('/category/:slug', category_controller.category_detail);
router.get('/categories', category_controller.categories_list);

// Use Case Routes
router.get('/use-case/create', useCase_controller.useCase_create_get);
router.post('/use-case/create', useCase_controller.useCase_create_post);
router.get('/use-case/:slug/delete', useCase_controller.useCase_delete_get);
router.post('/use-case/:slug/delete', useCase_controller.useCase_delete_post);
router.get('/use-case/:slug/update', useCase_controller.useCase_update_get);
router.post('/use-case/:slug/update', useCase_controller.useCase_update_post);
router.get('/use-case/:slug', useCase_controller.useCase_detail);
router.get('/use-cases', useCase_controller.useCases_list);

// About Route
router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
