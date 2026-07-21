import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authService'
import './LoginPage.css'

function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login({ name, password })
      navigate('/suppliers')
    } catch {
      setError('שם משתמש או סיסמה שגויים')
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>התחברות</h2>
        <label>
          שם משתמש
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">כניסה</button>
      </form>
    </div>
  )
}

export default LoginPage
