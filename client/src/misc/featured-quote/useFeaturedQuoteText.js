import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import api from 'shared/api';

// Get the list of featured quotes - text.
// Get a single quote to be featured. Refresh anytime the page location changes.
export function useFeaturedQuoteText() {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState('');
  const location = useLocation();

  async function fetchAllQuoteTexts() {
    const { result } = await api('/featured-quotes/text');
    setQuotes(result?.items || []);
  }

  // Fetch the list of all quotes (text only) just once.
  useEffect(() => {
    fetchAllQuoteTexts();
  }, []);

  // Pick a random quote from the list of quotes anytime the page location changes.
  useEffect(() => {
    if (quotes.length) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }
  }, [quotes, location.pathname]);

  return { quote };
}
