import _ from 'lodash';
import express from 'express';

import requireAdmin from '../session/requireAdmin.js';
import FeaturedQuote from './FeaturedQuote.model.js';

const router = express.Router();

// public routes
router.get('/text', listFeaturedQuotesTextRoute);

router.use(requireAdmin);

// protected routes
router.get('/', listFeaturedQuotesRoute);
router.post('/', createFeaturedQuoteRoute);
router.put('/:id', updateFeaturedQuoteRoute);

export default router;

////////////////////

async function createFeaturedQuoteRoute(req, res) {
  await FeaturedQuote.create({
    text: req.body.text,
    enabled: true,
  });
  res.send();
}

async function listFeaturedQuotesRoute(req, res) {
  const quotes = await FeaturedQuote.find();
  res.json({
    items: quotes.map(quote =>
      _.pick(quote, ['id', 'text', 'enabled', 'createdAt']),
    ),
  });
}

async function listFeaturedQuotesTextRoute(req, res) {
  const quotes = await FeaturedQuote.find({ enabled: true }).select('text');
  res.json({
    items: quotes.map(quote => quote.text),
  });
}

async function updateFeaturedQuoteRoute(req, res) {
  const quote = await FeaturedQuote.findById(req.params.id);
  if (!quote) {
    return res.status(404).send();
  }
  quote.text = req.body.text;
  quote.enabled = req.body.enabled;
  await quote.save();
  res.send();
}
