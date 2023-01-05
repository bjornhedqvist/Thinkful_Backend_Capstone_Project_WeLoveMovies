const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }

  return next({ status: 404, message: `error: Review cannot be found.` });
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data, review_id: res.locals.review.review_id
  }
  await service.update(updatedReview)
  const data = await service.reduceWithCritic(res.locals.review.review_id)
  res.json({ data });
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)]
};
