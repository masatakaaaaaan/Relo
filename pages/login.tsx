// pages/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    try {
      setLoading(true); setError(null)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setLoading(true); setError(null)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    <main style={{maxWidth: 420, margin: '40px auto', padding: 16}}>
      <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 16}}>ログイン / 新規登録</h1>
      <div style={{display: 'grid', gap: 8}}>
        <input
          placeholder="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{border:'1px solid #ddd', padding: 10, borderRadius: 8}}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{border:'1px solid #ddd', padding: 10, borderRadius: 8}}
        />
        {error && <p style={{color:'#c00', fontSize: 12}}>{error}</p>}
        <div style={{display:'flex', gap:8}}>
          <button disabled={loading} onClick={handleSignIn} style={{border:'1px solid #333', padding:'8px 12px', borderRadius:8}}>ログイン</button>
          <button disabled={loading} onClick={handleSignUp} style={{border:'1px solid #333', padding:'8px 12px', borderRadius:8}}>新規登録</button>
          <button onClick={handleGoogle} style={{border:'1px solid #333', padding:'8px 12px', borderRadius:8}}>Googleで続行</button>
        </div>
      </div>
    </main>
  )
}
