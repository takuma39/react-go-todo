import { useState, FormEvent } from 'react'
import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { useMutateAuth } from '../hooks/useMutateAuth'

export const Auth = () => {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const { loginMutation, registerMutation } = useMutateAuth()

  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      loginMutation.mutate({
        email: email,
        password: pw,
      })
    } else {
      await registerMutation
        .mutateAsync({
          email: email,
          password: pw,
        })
        .then(() =>
          loginMutation.mutate({
            email: email,
            password: pw,
          })
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono text-gray-600">
      <div className="flex items-center">
        <CheckBadgeIcon className="w-8 h-8 mr-2 text-blue-500" />
        <span className="text-3xl font-extrabold text-center">
          Todo app by React/Go(Echo)
        </span>
      </div>
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>
      <form onSubmit={submitAuthHandler}>
        <div>
          <input
            className="px-3 py-2 mb-3 text-sm border border-gray-300"
            name="email"
            type="email"
            autoFocus
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <input
            className="px-3 py-2 mb-3 text-sm border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
        </div>
        <div className="flex justify-center my-2">
          <button
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded disabled:opacity-40"
            disabled={!email || !pw}
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div
        onClick={() => setIsLogin(!isLogin)}
        className="flex items-center gap-1 cursor-pointer"
      >
        <ArrowPathIcon className="w-6 h-6 my-2 text-blue-500 cursor-pointer" />
        <span>{isLogin ? 'Sign Up' : 'Login'}</span>
      </div>
    </div>
  )
}
