import { getAuthHeader } from './auth';

export interface Template {
  id: string;
  title: string;
  description: string;
  elements: TemplateElement[];
  createdAt: string;
  userId: string;
  likes: number;
  comments: Comment[];
}

export interface TemplateElement {
  id?: string;
  type: 'text' | 'image';
  content?: string;
  url?: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const createTemplate = async (template: Omit<Template, 'id' | 'createdAt' | 'userId' | 'likes' | 'comments'>): Promise<Template> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
  
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers,
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to create template');
  }

  return response.json();
};

export const getTemplate = async (templateId: string): Promise<Template> => {
  const response = await fetch(`/api/templates/${templateId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }

  return response.json();
};

export const updateTemplate = async (templateId: string, template: Partial<Template>): Promise<Template> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const response = await fetch(`/api/templates/${templateId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to update template');
  }

  return response.json();
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  const headers: HeadersInit = getAuthHeader();
  
  const response = await fetch(`/api/templates/${templateId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
};

export const likeTemplate = async (templateId: string): Promise<{ liked: boolean; likesCount: number }> => {
  const headers: HeadersInit = getAuthHeader();
  
  const response = await fetch(`/api/templates/${templateId}/like`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to like template');
  }

  return response.json();
};

export const commentOnTemplate = async (templateId: string, content: string): Promise<Comment> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const response = await fetch(`/api/templates/${templateId}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to comment on template');
  }

  return response.json();
};

export const searchTemplates = async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Template>> => {
  const response = await fetch(`/api/search/templates?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to search templates');
  }

  return response.json();
};

export const uploadImage = async (file: File): Promise<{ id: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = getAuthHeader();

  const response = await fetch('/api/images/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
};

export const downloadTemplate = async (templateId: string): Promise<Blob> => {
  const headers: HeadersInit = getAuthHeader();
  
  const response = await fetch(`/api/templates/${templateId}/download`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to download template');
  }

  return response.blob();
}; 