'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Template, searchTemplates } from '@/lib/api';
import TemplateList from '@/components/TemplateList';
import { isAuthenticated } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push('/login');
  //     return;
  //   }

  //   loadTemplates();
  // }, [router]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await searchTemplates(searchQuery);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTemplates();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/templates/new"
              className="bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700"
            >
              Create Template
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Search
            </button>
          </div>
        </form>

        {/* Templates */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length > 0 ? (
          <TemplateList
            templates={templates}
            onTemplateUpdate={loadTemplates}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No templates found</p>
            <Link
              href="/templates/new"
              className="mt-4 inline-block bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700"
            >
              Create your first template
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 