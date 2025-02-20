// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Instructions from './pages/Instructions.jsx'
import Quiz from './components/QuizComponent/Quiz.jsx'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Instructions />
  },
  {
    path: "/quiz",
    element: <Quiz />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
