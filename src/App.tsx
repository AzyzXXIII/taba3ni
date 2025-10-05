import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark-mode");
  };

  return (
    <div className="min-h-screen bg-grey-50 dark:bg-grey-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-grey-800 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-500">🥛 Taba3ni</h1>
          <button onClick={toggleDarkMode} className="btn-outline">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl font-bold text-grey-900 dark:text-grey-100 mb-4">
            Dairy Distribution Management
          </h2>
          <p className="text-lg text-grey-600 dark:text-grey-400">
            Complete solution for managing your dairy distribution business
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-semibold mb-2 text-grey-900">
              Admin Dashboard
            </h3>
            <p className="text-grey-600">
              Manage clients, delivery team, and track all operations in
              real-time
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-semibold mb-2 text-grey-900">
              Distributor App
            </h3>
            <p className="text-grey-600">
              Track deliveries, collect payments, and optimize routes
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2 text-grey-900">
              Store Portal
            </h3>
            <p className="text-grey-600">
              Place orders, track deliveries, and manage invoices
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-outline">Outline Button</button>
        </div>

        {/* Test Badges */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <span className="badge-success">✓ Delivered</span>
          <span className="badge-warning">⏳ Pending</span>
          <span className="badge-error">✗ Failed</span>
          <span className="badge-info">ℹ Info</span>
        </div>

        {/* Test Input */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Test input field..."
            className="input-field"
          />
        </div>

        {/* Test Gradient */}
        <div className="mt-12 p-8 bg-gradient-brand rounded-lg text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
          <p>Your Tailwind v4 + Styled Components setup is working! 🎉</p>
        </div>
      </main>
    </div>
  );
}

export default App;
