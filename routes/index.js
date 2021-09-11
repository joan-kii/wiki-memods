const express = require('express');
const router = express.Router();

const article_controller = require('../controllers/articleController');
const category_controller = require('../controllers/categoryController');
const useCase_controller = require('../controllers/useCaseController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Article Routes
router.get('/article/create', article_controller.article_create_get);
router.post('/article/create', article_controller.article_create_post);
router.get('/article/:id/delete', article_controller.article_delete_get);
router.post('/article/:id/delete', article_controller.article_delete_post);
router.get('/article/:id/update', article_controller.article_update_get);
router.post('/article/:id/update', article_controller.article_update_post);
router.get('/article/:id', article_controller.article_detail);
router.get('/articles', article_controller.articles_list);

module.exports = router;
