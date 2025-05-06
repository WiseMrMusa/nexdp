'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Template, getTemplate, likeTemplate, commentOnTemplate, downloadTemplate } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

interface TemplatePageProps {
  params: {
    id: string;
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadTemplate();
  }, [params.id, router]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const data = await getTemplate(params.id);
      setTemplate(data);
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!template) return;

    try {
      const { liked: newLiked } = await likeTemplate(template.id);
      setLiked(newLiked);
      loadTemplate();
    } catch (error) {
      console.error('Failed to like template:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || !comment.trim()) return;

    try {
      await commentOnTemplate(template.id, comment);
      setComment('');
      loadTemplate();
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  };

  const handleDownload = async () => {
    if (!template) return;

    try {
      const blob = await downloadTemplate(template.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Template not found</h1>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                className="bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700"
              >
                Download
              </button>
              <Link
                href="/dashboard"
                className="bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Template Preview */}
          <div className="p-8">
            <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-lg">
              {/* Template preview would go here */}
            </div>
          </div>

          {/* Template Info */}
          <div className="border-t border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={liked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{template.likes}</span>
                </button>
                <Link
                  href={`/users/${template.userId}`}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  By {template.userId}
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                Created {new Date(template.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-4 text-gray-600">{template.description}</p>
          </div>

          {/* Comments */}
          <div className="border-t border-gray-200 px-8 py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="bg-indigo-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Comment
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {template.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/users/${comment.userId}`}
                        className="font-medium text-gray-900"
                      >
                        {comment.username}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 