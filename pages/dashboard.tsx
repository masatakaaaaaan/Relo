// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Stale = { id: string; name: string; last_visit_at: string | null };

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [stale, setStale] = useState<Stale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth/signin'; return; }
      setEmail(session.user.email ?? null);

      const thresholdDate = new Date(Date.now() - 30*24*60*60*1000).toISOString().slice(0,10);
      const { data } = await supabase
        .from('customers')
        .select('id,name,last_visit_at')
        .or(`last_visit_at.is.null,last_visit_at.lte.${thresholdDate}`)
        .order('last_visit_at', { ascending: true, nullsFirst: true });

      setStale((data ?? []) as Stale[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <main className="p-6">Loading...</main>;

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button
          className="border px-3 py-1 rounded"
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/signin'; }}
        >
          Sign out
        </button>
      </header>
      <p className="text-sm text-gray-600">Hi, {email}</p>
      <section>
        <h2 className="font-semibold mb-2">30日以上未訪問</h2>
        <ul className="list-disc pl-6">
          {stale.map(s => <li key={s.id}>{s.name}（最終: {s.last_visit_at ?? '-'}）</li>)}
        </ul>
      </section>
    </main>
  );
}
