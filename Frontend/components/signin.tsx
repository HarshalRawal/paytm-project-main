
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { X, Mail, Lock, ArrowRight, AlertCircle, Sun, Moon } from 'lucide-react'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }
  const signin = async ()=>{
    const user = await axios.post("http://localhost:6001/signin" , {
      email :email,
      password : password
    })

    
    
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <button className="text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close">
                <X size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Sign in</h1>
              <div className="w-6"></div>
            </div>

            <form className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  required
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
              <button className="group relative w-full overflow-hidden rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={signin}>
                <span className="relative z-10">Sign in</span>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:right-3 group-hover:opacity-100" size={20} />
              </button>
            </form>

            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">or</span>
            </div>

            <button className="group flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-blue-500 transition-colors hover:text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                Sign up
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 bg-blue-50 p-8 dark:bg-gray-900 md:items-start">
            <h2 className="animate-pulse text-3xl font-bold text-blue-600 dark:text-blue-400 md:text-4xl lg:text-5xl">
              Welcome Back!
            </h2>
            <p className="text-center text-xl text-gray-600 dark:text-gray-300 md:text-left md:text-2xl">
              Your global money exchange awaits.
            </p>
            <div className="mt-8">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-16 w-16 text-blue-500 transition-all duration-300 ease-in-out hover:scale-110 dark:text-blue-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 6v2m0 8v2" />
                </svg>
                <div className="absolute -right-2 -top-2 animate-ping">
                  <AlertCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-800 shadow-lg transition-all duration-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        aria-label="Toggle theme"
      >
        <div className="relative h-6 w-6 overflow-hidden">
          <Sun className={`absolute transition-all duration-300 ${isDarkMode ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
          <Moon className={`absolute transition-all duration-300 ${isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
        </div>
      </button>
    </div>
  )
}
