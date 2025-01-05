import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

schema.statics.getAllSharedData = async function () {
  const quotes = await this.find({ enabled: true }).select('text');
  return quotes.map(quote => quote.text);
};

const FeaturedQuote = mongoose.model('FeaturedQuote', schema);

export default FeaturedQuote;
