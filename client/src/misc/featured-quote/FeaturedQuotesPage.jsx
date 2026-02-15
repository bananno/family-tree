import clsx from 'clsx';
import partition from 'lodash/partition';
import { useEffect, useState } from 'react';

import { useFeaturedQuotes } from 'misc/featured-quote/useFeaturedQuotes';
import api from 'shared/api';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

export default function FeaturedQuotesPage() {
  const { quotes, refetch } = useFeaturedQuotes();
  const [selectedQuote, setSelectedQuote] = useState(null);

  return (
    <div className="flex flex-col items-start space-y-4">
      <h1 className="text-2xl font-bold">Featured Quotes</h1>
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
    </div>
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
    const path = `/featured-quotes/${quote.id}`;

    await api(path, { method: 'PUT', body });

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
  const [enabled, disabled] = partition(quotes, 'enabled');

  const headerClass = 'p-4 text-left border border-gray-300 p-4';
  const cellClass = 'p-4 border border-gray-300';

  return (
    <table className="mt-4">
      <thead>
        <tr>
          <th className={headerClass}>Quote</th>
          <th className={clsx(headerClass, 'min-w-40')}>Created At</th>
          <th className={headerClass}>Edit</th>
        </tr>
      </thead>
      {[enabled, disabled].map((quotes, i) => (
        <tbody key={i}>
          {i > 0 && (
            <tr>
              <th colSpan="3" className="p-4 border border-gray-300">
                Disabled
              </th>
            </tr>
          )}
          {quotes.map(quote => (
            <tr key={quote.id}>
              <td className={cellClass}>{quote.text}</td>
              <td className={cellClass}>{quote.createdAt.slice(0, 10)}</td>
              <td className={cellClass}>
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
    await api('/featured-quotes', {
      method: 'POST',
      body: { text: newQuote },
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
