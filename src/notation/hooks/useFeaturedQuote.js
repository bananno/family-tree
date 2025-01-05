import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import staticDb from 'staticDb';

import { useStaticDb } from '../../SETTINGS';

const API_URL = 'http://localhost:9000';

export default function useFeaturedQuote() {
  const [quotes, setQuotes] = useState([]);
  const [chosenQuote, setChosenQuote] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (useStaticDb) {
      const notations = staticDb.notations.filter(
        notation => notation.tags['featured quote'],
      );
      setQuotes(notations.map(notation => notation.text));
      return;
    }
    fetch(`${API_URL}/featured-quotes`)
      .then(res => res.json())
      .then(res => {
        setQuotes(res);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      });
  }, []);

  useEffect(() => {
    if (quotes.length) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setChosenQuote(quotes[randomIndex]);
    }
  }, [quotes, location.pathname]);

  return {
    quote: chosenQuote,
  };
}
