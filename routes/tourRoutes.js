const express = require('express');

const tourController = require('./../controllers/tourController');

const authController = require('./../controllers/authController');

const router = express.Router();

// Middleware para verificar ID nas rotas de passeios.
// router.param('id', tourController.checkID);

/**
 * Define uma rota GET para 'top-5-cheap' que aplica middleware para ajustar os parâmetros da query string.
 * @param {string} '/top-5-cheap' - Endpoint para obter os top 5 tours baratos.
 * @param {Function} tourController.aliasTopTours - Middleware para ajustar os parâmetros da query string.
 */
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

/** Define a rota '/api/v1/tours' com métodos GET e POST. */
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
/** Define a rota '/api/v1/tours/:id' com métodos GET, PATCH e DELETE. */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
