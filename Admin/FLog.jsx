import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input } from '../Components/Input'
import { Button } from '../Components/Button'
import { useAuth } from '../Routings/Authentic'

const FLog = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth() // assuming you have an auth context

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/FinanceLogin', {
        username,
        password,
      })

      if (response.data.success) {
        setError('')
        login() // update auth context
        navigate('/Flog') // go to dashboard financeLoggin
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || 'Server error'))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-[#ffeef3] p-4">


      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Finance Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-2 right-3 text-sm text-pink-500 cursor-pointer select-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Remember me</span>
            </label>

          </div>

          <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-500 text-white">
            Sign in
          </Button>
        </form>

 
      </div>
    </div>
  )
}

export default FLog

