import React, { useState } from 'react';

import { useFeaturedQuotes } from 'misc/featured-quote/useFeaturedQuotes';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

const API_URL = 'http://localhost:9000';

export default function FeaturedQuotesPage() {
  const { quotes, refetch } = useFeaturedQuotes();

  return (
    <>
      <h1>Featured Quotes</h1>
      <NewFeaturedQuoteModal refetch={refetch} />
      <FeaturedQuotesTable quotes={quotes} />
    </>
  );
}

////////////////////

function FeaturedQuotesTable({ quotes }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Quote</th>
          <th>Enabled</th>
          <th>Created At</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map(quote => (
          <tr key={quote.id}>
            <td>{quote.text}</td>
            <td>{quote.enabled ? 'Yes' : 'No'}</td>
            <td>{quote.createdAt}</td>
            <td>
              <Button disabled text="Edit (TODO)" />
            </td>
          </tr>
        ))}
      </tbody>
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
