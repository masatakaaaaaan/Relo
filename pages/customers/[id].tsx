import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Customer = { id: string; name: string; phone: string|null; last_visit_at: string|null; note: string|null; };
type Visit = { id: string; visited_at: string; menu: string|null; price: number|null; stylist: string|null; memo: string|null; };

export default function CustomerDetail() {
  const r = useRouter();
  const id = r.query.id as string | undefined;

  const [c, setC] = useState<Customer | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  // 来店入力
  const [visitedAt, setVisitedAt] = useState<string>(() => new Date().toISOString().slice(0,16));
  const [menu, setMenu] = useState('Cut');
  const [price, setPrice] = useState<string>('5000');
  const [stylist, setStylist] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/auth/signin'; return; }

      const { data: cust, error: e1 } = await supabase
        .from('customers')
        .select('*').eq('id', id).single();
      if (e1) { setErr(e1.message); setLoading(false); return; }
      setC(cust as Customer);

      const { data: vs } = await supabase
        .from('visits')
        .select('id,visited_at,menu,price,stylist,memo')
        .eq('customer_id', id)
        .order('visited_at', { ascending: false });
      setVisits((vs ?? []) as Visit[]);
      setLoading(false);
    })();
  }, [id]);

  const addVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('visits').insert({
      owner_id: user.id,
      customer_id: id,
      visited_at: new Date(visitedAt).toISOString(),
      menu: menu || null,
      price: price ? Number(price) : null,
      stylist: stylist || null,
      memo: memo || null
    });
    if (error) { setErr(error.message); return; }

    // last_visit_at を反映（date型なので YYYY-MM-DD に整形）
    await supabase
      .from('customers')
      .update({ last_visit_at: new Date(visitedAt).toISOString().slice(0,10) })
      .eq('id', id);

    // 再取得
    const { data: vs } = await supabase
      .from('visits')
      .select('id,visited_at,menu,price,stylist,memo')
      .eq('customer_id', id)
      .order('visited_at', { ascending: false });
    setVisits((vs ?? []) as Visit[]);
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (err) return <main className="p-6 text-red-600">{err}</main>;
  if (!c) return <main className="p-6">Not found</main>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{c.name}</h1>
        <Link className="underline" href="/customers">Back</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-2">
          <p><b>Phone:</b> {c.phone ?? '-'}</p>
          <p><b>Last visit:</b> {c.last_visit_at ?? '-'}</p>
          <p><b>Note:</b> {c.note ?? '-'}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Add Visit</h2>
          <form onSubmit={addVisit} className="space-y-2">
            <input type="datetime-local" className="w-full border p-2 rounded"
                   value={visitedAt} onChange={e=>setVisitedAt(e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Menu"
                   value={menu} onChange={e=>setMenu(e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Price"
                   value={price} onChange={e=>setPrice(e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Stylist (optional)"
                   value={stylist} onChange={e=>setStylist(e.target.value)} />
            <textarea className="w-full border p-2 rounded" placeholder="Memo (optional)"
                      value={memo} onChange={e=>setMemo(e.target.value)} />
            <button className="border rounded px-3 py-2">Save Visit</button>
          </form>
        </section>
      </div>

      <section>
        <h2 className="font-semibold mb-2">Visits</h2>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead><tr className="bg-gray-50">
              <th className="p-2 text-left">Visited At</th>
              <th className="p-2 text-left">Menu</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stylist</th>
              <th className="p-2 text-left">Memo</th>
            </tr></thead>
            <tbody>
              {visits.map(v => (
                <tr key={v.id} className="border-t">
                  <td className="p-2">{new Date(v.visited_at).toLocaleString()}</td>
                  <td className="p-2">{v.menu ?? '-'}</td>
                  <td className="p-2">{v.price ?? '-'}</td>
                  <td className="p-2">{v.stylist ?? '-'}</td>
                  <td className="p-2">{v.memo ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

