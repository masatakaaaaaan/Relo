import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function NewCustomer() {
  const r = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) window.location.href = '/auth/signin';
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr('Not signed in'); setLoading(false); return; }

    const { error } = await supabase.from('customers').insert({
      owner_id: user.id,
      name,
      phone: phone || null,
      note: note || null
    });

    setLoading(false);
    if (error) return setErr(error.message);
    r.push('/customers');
  };

  return (
    <main className="min-h-screen p-6">
      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <h1 className="text-xl font-semibold">New Customer</h1>
        <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Phone (optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="border rounded px-3 py-2">{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </main>
  );
}
