import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { User } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [resetPassword, setResetPassword] = useState(false)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setResetPassword(true)
        } else {
          setUser(session?.user ?? null)
          setResetPassword(false)
        }
      }
    )

    // Check initial session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    checkUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (resetPassword) {
    return <ForgotPassword />
  }

  if (!user) {
    return <Auth />
  }

  return <Dashboard user={user} />
}

export default App
