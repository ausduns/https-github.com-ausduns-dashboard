import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, ArrowLeft, KeyRound } from 'lucide-react'

type PasswordResetMode = 'request' | 'reset'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mode, setMode] = useState<PasswordResetMode>('request')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setSuccess('Password reset link sent to your email. Check your inbox.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setSuccess('Password successfully updated')
      setMode('request')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const renderPasswordResetRequest = () => (
    <form onSubmit={handlePasswordResetRequest} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-600 hover:bg-royal-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue-500"
      >
        <Mail className="mr-2 h-5 w-5" />
        Send Reset Link
      </button>
    </form>
  )

  const renderPasswordReset = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="New password"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="password" 
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Confirm new password"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-royal-blue-500 focus:border-royal-blue-500"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-royal-blue-600 hover:bg-royal-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-blue-500"
      >
        <KeyRound className="mr-2 h-5 w-5" />
        Reset Password
      </button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-xl p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'request' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'request' 
              ? 'Enter your email to receive a password reset link' 
              : 'Create a new password for your account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-center">
            {success}
          </div>
        )}

        {mode === 'request' ? renderPasswordResetRequest() : renderPasswordReset()}

        {mode === 'reset' && (
          <div className="text-center">
            <button 
              onClick={() => setMode('request')}
              className="text-sm text-royal-blue-600 hover:text-royal-blue-500 flex items-center justify-center w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reset Request
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
