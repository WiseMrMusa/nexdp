'use client';

import { useRouter } from 'next/navigation';
import { createTemplate } from '@/lib/api';
import TemplateEditor from '@/components/TemplateEditor';
import { isAuthenticated } from '@/lib/auth';

export default function NewTemplatePage() {
  const router = useRouter();

  if (!isAuthenticated()) {
    router.push('/login');
    return null;
  }

  const handleSave = async (template: any) => {
    try {
      await createTemplate(template);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-foreground">Create New Template</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border shadow-sm">
          <TemplateEditor onSave={handleSave} />
        </div>
      </main>
    </div>
  );
} 