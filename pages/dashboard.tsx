// pages/dashboard.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

type Customer = {
  id: string
  name: string
  email: string | null
  total_spent: number | null
  rank: string | null
}

export default function Dashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      setUserEmail(user.email ?? null)

      // ★ まずは全件取得で動作確認（RLS/tenantフィルタは後で入れる）
      const { data, error } = await supabase
        .from('customers')
        .select('id,name,email,total_spent,rank')
        .limit(20)
      if (error) setError(error.message)
      else setCustomers(data ?? [])
      setLoading(false)
    })()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={{maxWidth: 720, margin: '40px auto', padding: 16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
        <h1 style={{fontSize: 24, fontWeight: 700}}>ダッシュボード</h1>
        <button onClick={logout} style={{border:'1px solid #333', padding:'6px 10px', borderRadius:8}}>ログアウト</button>
      </div>
      <p style={{fontSize:12, opacity:.7}}>ログインユーザー: {userEmail ?? '-'}</p>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{color:'#c00'}}>{error}</p>}

      <ul style={{display:'grid', gap:8, marginTop:12}}>
        {customers.map(c => (
          <li key={c.id} style={{border:'1px solid #eee', borderRadius:10, padding:12}}>
            <div style={{fontWeight:600}}>{c.name}</div>
            <div style={{fontSize:12, opacity:.7}}>{c.email ?? '—'}</div>
            <div style={{fontSize:12, marginTop:4}}>
              合計金額: {c.total_spent ?? 0} / ランク: {c.rank ?? '—'}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
