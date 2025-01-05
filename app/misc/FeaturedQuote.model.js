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

const FeaturedQuote = mongoose.model('FeaturedQuote', schema);

export default FeaturedQuote;
