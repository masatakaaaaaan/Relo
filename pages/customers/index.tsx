import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Customer = { id: string; name: string; phone: string | null; last_visit_at: string | null };

export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth/signin'; return; }
      const { data } = await supabase
        .from('customers')
        .select('id,name,phone,last_visit_at')
        .order('last_visit_at', { ascending: false, nullsFirst: false });
      setRows((data ?? []) as Customer[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <main className="p-6">Loading...</main>;

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customers</h1>
        <Link className="border px-3 py-1 rounded" href="/customers/new">+ New</Link>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <Link className="underline" href={`/customers/${c.id}`}>{c.name}</Link>
                </td>
                <td className="p-2">{c.phone ?? '-'}</td>
                <td className="p-2">{c.last_visit_at ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
