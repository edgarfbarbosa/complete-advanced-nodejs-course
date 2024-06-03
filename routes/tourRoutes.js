const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();

/** Define a rota '/api/v1/tours' com métodos GET e POST. */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
/** Define a rota '/api/v1/tours/:id' com métodos GET, PATCH e DELETE. */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
