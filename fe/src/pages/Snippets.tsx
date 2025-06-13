import React, { useState } from 'react';

interface Snippet {
  id: number;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

const Snippets: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const snippets: Snippet[] = [
    {
      id: 1,
      title: 'Custom React Hook: useLocalStorage',
      description: 'A custom hook to persist state in localStorage',
      language: 'typescript',
      code: `const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};`,
      tags: ['react', 'hooks', 'typescript', 'localStorage']
    },
    {
      id: 2,
      title: 'Debounce Function',
      description: 'A utility function to debounce function calls',
      language: 'typescript',
      code: `const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`,
      tags: ['typescript', 'utility', 'performance']
    },
    {
      id: 3,
      title: 'API Error Handler',
      description: 'A reusable error handling utility for API calls',
      language: 'typescript',
      code: `class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const handleAPIError = (error: unknown): never => {
  if (error instanceof APIError) {
    // Handle known API errors
    console.error(\`API Error: \${error.status} - \${error.message}\`);
    throw error;
  }
  
  if (error instanceof Error) {
    // Handle general errors
    console.error(\`Error: \${error.message}\`);
    throw new APIError(500, 'Internal Server Error');
  }
  
  // Handle unknown errors
  console.error('Unknown error:', error);
  throw new APIError(500, 'An unexpected error occurred');
};`,
      tags: ['typescript', 'error-handling', 'api']
    }
  ];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Code Snippets</h1>
          <p className="text-xl text-gray-600">A collection of useful code examples and utilities</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Languages</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid gap-8">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{snippet.title}</h2>
                    <p className="text-gray-600">{snippet.description}</p>
                  </div>
                  <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {snippet.language}
                  </span>
                </div>
                <div className="mt-4">
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Snippets; 