import _ from 'lodash';
import mongoose from 'mongoose';

const FeaturedQuote = mongoose.model('FeaturedQuote');

export async function createFeaturedQuoteRoute(req, res) {
  res.json({});
}

export async function deleteFeaturedQuoteRoute(req, res) {
  res.json({});
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
  res.json({});
}
