'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Template, likeTemplate } from '@/lib/api';

interface TemplateListProps {
  templates: Template[];
  onTemplateUpdate?: () => void;
}

export default function TemplateList({ templates, onTemplateUpdate }: TemplateListProps) {
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());

  const handleLike = async (templateId: string) => {
    try {
      const { liked, likesCount } = await likeTemplate(templateId);
      if (liked) {
        setLikedTemplates((prev) => new Set([...prev, templateId]));
      } else {
        setLikedTemplates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(templateId);
          return newSet;
        });
      }
      onTemplateUpdate?.();
    } catch (error) {
      console.error('Failed to like template:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4">
            <Link
              href={`/templates/${template.id}`}
              className="text-xl font-semibold text-gray-900 hover:text-indigo-600"
            >
              {template.title}
            </Link>
            <p className="mt-2 text-gray-600">{template.description}</p>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(template.id)}
                  className={`flex items-center space-x-1 ${
                    likedTemplates.has(template.id)
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={likedTemplates.has(template.id) ? 'currentColor' : 'none'}
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
                  href={`/templates/${template.id}#comments`}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{template.comments.length}</span>
                </Link>
              </div>
              <Link
                href={`/users/${template.userId}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                By {template.userId}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 