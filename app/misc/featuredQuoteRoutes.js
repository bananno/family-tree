import _ from 'lodash';
import mongoose from 'mongoose';

const FeaturedQuote = mongoose.model('FeaturedQuote');

export async function createFeaturedQuoteRoute(req, res) {
  await FeaturedQuote.create({
    text: req.body.text,
    enabled: true,
  });
  res.send();
}

export async function listFeaturedQuotesRoute(req, res) {
  const quotes = await FeaturedQuote.find();
  res.json({
    data: quotes.map(quote =>
      _.pick(quote, ['id', 'text', 'enabled', 'createdAt'])
    ),
  });
}

export async function listFeaturedQuotesTextRoute(req, res) {
  const quotes = await FeaturedQuote.find({ enabled: true }).select('text');
  res.json({
    data: quotes.map(quote => quote.text),
  });
}

export async function updateFeaturedQuoteRoute(req, res) {
  const quote = await FeaturedQuote.findById(req.params.id);
  if (!quote) {
    return res.status(404).send();
  }
  quote.text = req.body.text;
  quote.enabled = req.body.enabled;
  await quote.save();
  res.send();
}
