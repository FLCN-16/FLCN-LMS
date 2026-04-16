import { Helmet } from "react-helmet-async"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Helmet>
        <title>FLCN SaaS Admin</title>
        <meta name="description" content="FLCN SaaS Admin Dashboard" />
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    FLCN SaaS Admin
                  </h1>
                  <p className="text-lg text-slate-600">Dashboard coming soon...</p>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
