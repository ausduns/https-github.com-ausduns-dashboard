import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogIn, UserPlus, KeyRound } from 'lucide-react'
import ForgotPassword from './ForgotPassword'  // Add this import

type AuthMode = 'login' | 'signup'

const Auth: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [error, setError] = useState<string | null>(null)
  const [forgotPassword, setForgotPassword] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (forgotPassword) {
    return <ForgotPassword />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-royal-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {mode === 'login' 
              ? 'Sign in to continue' 
              : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
            />
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-royal-blue-600 hover:text-royal-blue-500"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-600 hover:bg-royal-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue-500"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-royal-blue-600 hover:text-royal-blue-500"
          >
            {mode === 'login' 
              ? 'Need an account? Sign Up' 
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
