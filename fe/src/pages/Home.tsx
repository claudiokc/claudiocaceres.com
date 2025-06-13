import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-400/80 via-indigo-400/80 to-pink-400/80 text-white shadow-xl p-8 sm:p-12 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Claudio Caceres</h1>
          <p className="text-2xl mb-8 font-medium drop-shadow">Software Engineer & Full Stack Developer</p>
          <div className="flex justify-center space-x-4">
            <a href="/contact" className="bg-white/90 text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-white transition duration-300">
              Get in Touch
            </a>
            <a href="/resume" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/80 hover:text-blue-700 transition duration-300">
              View Resume
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">What I Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-blue-600 text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold mb-2">Web Development</h3>
            <p className="text-gray-600 text-center">Building modern, responsive web applications using React, TypeScript, and other cutting-edge technologies.</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-blue-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Development</h3>
            <p className="text-gray-600 text-center">Creating cross-platform mobile applications that deliver exceptional user experiences.</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-blue-600 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Full Stack Solutions</h3>
            <p className="text-gray-600 text-center">End-to-end development from database design to frontend implementation.</p>
          </div>
        </div>
      </section>

      {/* Latest Snippets Preview */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Latest Code Snippets</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/90 text-white p-6 rounded-xl shadow-lg">
            <pre className="overflow-x-auto text-sm">
              <code>{`// Example React Hook\nconst useLocalStorage = (key, initialValue) => {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n  // ... rest of the implementation\n};`}</code>
            </pre>
          </div>
          <div className="bg-gray-900/90 text-white p-6 rounded-xl shadow-lg">
            <pre className="overflow-x-auto text-sm">
              <code>{`// TypeScript Interface\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n  preferences: {\n    theme: 'light' | 'dark';\n    notifications: boolean;\n  };\n}`}</code>
            </pre>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/snippets" className="text-blue-700 hover:text-blue-900 font-semibold underline underline-offset-4">
            View All Snippets →
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home; 