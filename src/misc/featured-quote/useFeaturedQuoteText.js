import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import staticDb from 'staticDb';

import { useStaticDb } from '../../SETTINGS';

const API_URL = 'http://localhost:9000';

// Get the list of featured quotes - text.
// Get a single quote to be featured. Refresh anytime the page location changes.
export function useFeaturedQuoteText() {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState('');
  const location = useLocation();

  // Fetch the list of all quotes (text only) just once.
  useEffect(() => {
    if (useStaticDb) {
      setQuotes(staticDb.featuredQuotes);
      return;
    }
    fetch(`${API_URL}/featured-quotes-text`)
      .then(res => res.json())
      .then(res => {
        setQuotes(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      });
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
