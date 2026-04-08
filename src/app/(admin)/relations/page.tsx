import React from 'react';
import RelationsClient from './components/relations-client';

export const metadata = {
  title: 'Relations Management | Admin',
};

export default function RelationsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden w-full p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Relations Management</h1>
        <p className="text-muted-foreground text-sm">
          Link Frameworks and Features together to configure the system.
        </p>
      </div>
      <div className="flex-1 w-full bg-background border rounded-lg overflow-hidden shadow-sm">
        <RelationsClient />
      </div>
    </div>
  );
}
