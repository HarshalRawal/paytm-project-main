'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Euro, Bitcoin, ArrowLeftRight, Sun, Moon, Mail, Lock, User, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', { username, email, password })
  }

  const signupButton =async ()=>{
    const newuser = await axios.post("http://localhost:6001/new-user" , {
      name : username,
      password : password,
      email : email
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <button className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                <X size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Sign up</h1>
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  placeholder="Choose a username"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={signupButton}
              >
                <span className="relative z-10">Sign up</span>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100" size={20} />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">or</span>
            </div>

            <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-blue-300 dark:focus:ring-offset-gray-800">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href="#" className="font-semibold text-blue-500 hover:underline dark:text-blue-400">
                Log in
              </a>
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center space-y-6 overflow-hidden bg-blue-50 p-8 md:items-start dark:bg-gray-700">
            <h2 className="text-3xl font-bold text-blue-600 md:text-4xl lg:text-5xl transition-all duration-300 ease-in-out hover:scale-105 dark:text-blue-400">
              Instant Money Exchange
            </h2>
            <p className="text-center text-xl text-gray-600 md:text-left md:text-2xl transition-all duration-300 ease-in-out hover:translate-x-2 dark:text-gray-300">
              Send, receive, and exchange money in seconds!
            </p>

            {/* Animated objects */}
            <DollarSign className="absolute top-4 left-4 h-8 w-8 text-green-500 animate-bounce dark:text-green-400" />
            <Euro className="absolute top-1/4 right-8 h-6 w-6 text-blue-500 animate-pulse dark:text-blue-400" />
            <Bitcoin className="absolute bottom-1/4 left-8 h-10 w-10 text-orange-500 animate-spin-slow dark:text-orange-400" />
            <ArrowLeftRight className="absolute bottom-8 right-4 h-8 w-8 text-purple-500 animate-ping dark:text-purple-400" />
          </div>
        </div>

        {/* Additional floating objects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="relative h-40 w-40">
            <div className="absolute h-4 w-4 rounded-full bg-yellow-400 animate-float1 dark:bg-yellow-300"></div>
            <div className="absolute h-6 w-6 rounded-full bg-green-400 animate-float2 dark:bg-green-300"></div>
            <div className="absolute h-5 w-5 rounded-full bg-red-400 animate-float3 dark:bg-red-300"></div>
            <div className="absolute h-3 w-3 rounded-full bg-blue-400 animate-float4 dark:bg-blue-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}