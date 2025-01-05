import React, { useEffect, useState } from 'react';

import { useFeaturedQuotes } from 'misc/featured-quote/useFeaturedQuotes';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

const API_URL = 'http://localhost:9000';

export default function FeaturedQuotesPage() {
  const { quotes, refetch } = useFeaturedQuotes();
  const [selectedQuote, setSelectedQuote] = useState(null);

  return (
    <>
      <h1>Featured Quotes</h1>
      <NewFeaturedQuoteModal refetch={refetch} />
      <FeaturedQuotesTable
        quotes={quotes}
        setSelectedQuote={setSelectedQuote}
      />
      <EditQuoteModal
        quote={selectedQuote}
        refetch={refetch}
        clearSelection={() => setSelectedQuote(null)}
      />
    </>
  );
}

////////////////////

function EditQuoteModal({ quote, refetch, clearSelection }) {
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setText(quote?.text);
    setEnabled(quote?.enabled);
  }, [quote]);

  async function handleSubmit() {
    const body = { text, enabled };
    const path = `${API_URL}/featured-quotes/${quote.id}`;

    await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    clearSelection();
    refetch();
  }

  return (
    <Modal
      title="Edit Quote"
      open={!!quote}
      onCancel={clearSelection}
      onConfirm={handleSubmit}
      confirmButtonLabel="Save"
    >
      <Input value={text} onChange={setText} textarea />
      <br />
      Enabled:
      <Button
        text={enabled ? 'true' : 'false'}
        onClick={() => setEnabled(!enabled)}
      />
    </Modal>
  );
}

function FeaturedQuotesTable({ quotes, setSelectedQuote }) {
  const [enabled, disabled] = _.partition(quotes, 'enabled');

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Quote</th>
          <th>Created At</th>
          <th>Edit</th>
        </tr>
      </thead>
      {[enabled, disabled].map((quotes, i) => (
        <tbody key={i}>
          {i > 0 && (
            <tr>
              <th colSpan="3">Disabled</th>
            </tr>
          )}
          {quotes.map(quote => (
            <tr key={quote.id}>
              <td>{quote.text}</td>
              <td>{quote.createdAt.slice(0, 10)}</td>
              <td>
                <Button text="Edit" onClick={() => setSelectedQuote(quote)} />
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

function NewFeaturedQuoteModal({ refetch }) {
  const [newQuote, setNewQuote] = useState('');

  async function handleSubmit() {
    const body = { text: newQuote };
    const path = `${API_URL}/featured-quotes`;

    await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setNewQuote('');
    refetch();
  }

  return (
    <Modal
      title="Add Quote"
      triggerButtonLabel="Add Quote"
      confirmButtonLabel="Save"
      onConfirm={handleSubmit}
    >
      <Input value={newQuote} onChange={setNewQuote} textarea />
    </Modal>
  );
}
