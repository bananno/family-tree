import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import UploadFileForm from 'file/components/UploadFileForm';
import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const CATEGORY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'avatar', label: 'Avatar' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown' },
];

export default function FilesPage() {
  const { admin } = useSessionContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
  const limit = PAGE_SIZE_OPTIONS.includes(parseInt(searchParams.get('limit')))
    ? parseInt(searchParams.get('limit'))
    : 20;
  const category = searchParams.get('category') || '';

  function updateParams(updates) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      return next;
    });
  }

  async function fetchFiles() {
    let path = `/files?page=${page}&limit=${limit}`;
    if (category) {
      path += `&category=${category}`;
    }

    const { error, result } = await api(path);

    setError(error);
    setFiles(result?.items || []);
    setTotalPages(result?.totalPages || 1);
    setTotalCount(result?.totalCount || 0);
  }

  useEffect(() => {
    fetchFiles();
  }, [admin, page, limit, category]);

  if (!admin) {
    return <p>This page is private.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Files</h2>

      <UploadFileForm />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-gray-500">
          {totalCount} file{totalCount !== 1 ? 's' : ''}
        </p>

        <label className="flex items-center gap-1 text-sm">
          Show
          <select
            value={limit}
            onChange={e => updateParams({ limit: e.target.value, page: '' })}
            className="rounded border px-1 py-0.5"
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          per page
        </label>

        <label className="flex items-center gap-1 text-sm">
          Category
          <select
            value={category}
            onChange={e => updateParams({ category: e.target.value, page: '' })}
            className="rounded border px-1 py-0.5"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={page <= 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm">Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={e => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= totalPages) {
                updateParams({ page: String(val) });
              }
            }}
            className="w-14 rounded border px-1 py-0.5 text-center text-sm"
          />
          <span className="text-sm">of {totalPages}</span>
          <button
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={page >= totalPages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map(file => (
          <div
            key={file.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex h-48 items-center justify-center bg-gray-50 p-2">
              <img
                src={file.url}
                style={{ maxHeight: '176px', maxWidth: '100%' }}
                className="object-contain"
                alt={file.filename}
              />
            </div>
            <div className="flex flex-col gap-1 p-3">
              <p className="truncate text-sm font-medium" title={file.filename}>
                {file.filename}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    file.category === 'avatar'
                      ? 'bg-blue-100 text-blue-700'
                      : file.category === 'other'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {file.category}
                </span>
                {file.person && (
                  <Link
                    to={`/person/${file.person.personId}`}
                    className="truncate text-xs text-blue-600 hover:underline"
                  >
                    {file.person.personName}
                  </Link>
                )}
                {file.parent && (
                  <Link
                    to={`/${file.parent.parentType}/${file.parent.parentId}`}
                    className="truncate text-xs text-blue-600 hover:underline"
                  >
                    {file.parent.parentTitle}{' '}
                    <span className="text-gray-400">
                      ({file.parent.parentType})
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
