'use client';

import { api } from '@/lib/api';

export async function exportApplicationsCsv() {
  const response = await api.get(
    '/export/applications/csv',
    {
      responseType: 'blob',
    },
  );

  const blob = new Blob(
    [response.data],
    {
      type: 'text/csv',
    },
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;
  link.download =
    'jobtracker-applications.csv';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function exportApplicationsPdf() {
  const response = await api.get(
    '/export/applications/pdf',
    {
      responseType: 'blob',
    },
  );

  const blob = new Blob(
    [response.data],
    {
      type: 'application/pdf',
    },
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;
  link.download =
    'jobtracker-applications.pdf';

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}