import { User, Project, ProjectListItem, ProjectPlan, MentorMessage, DebugDiagnosis } from '../types';

const TOKEN_KEY = 'skillbridge_auth_token';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Status
  getStatus: () => request<{ geminiConnected: boolean; demoMode: boolean; message: string }>('/api/status'),

  // Auth
  register: (body: { name: string; email: string; password: string; confirmPassword?: string }) =>
    request<{ message: string; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),

  // Projects
  getProjects: () => request<{ projects: ProjectListItem[] }>('/api/projects'),

  getProject: (id: string) => request<{ project: Project }>(`/api/projects/${id}`),

  createProject: (body: {
    name: string;
    description: string;
    difficulty?: string;
    language?: string;
    plan: ProjectPlan;
  }) =>
    request<{ message: string; projectId: string }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProject: (id: string, body: Partial<{ name: string; description: string; difficulty: string; language: string; plan: ProjectPlan }>) =>
    request<{ message: string }>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteProject: (id: string) =>
    request<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  generatePlan: (body: {
    projectName: string;
    description: string;
    language?: string;
    difficulty?: string;
    requirements?: string;
  }) =>
    request<{ plan: ProjectPlan; isDemoMode: boolean }>('/api/projects/generate-plan', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  toggleStep: (projectId: string, stepId: string, completed: boolean) =>
    request<{
      message: string;
      stepId: string;
      completed: boolean;
      completedAt: string | null;
      stats: any;
    }>(`/api/projects/${projectId}/steps/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    }),

  getProgress: (projectId: string) =>
    request<{ stats: any; steps: any[] }>(`/api/projects/${projectId}/progress`),

  seedDemoProject: () =>
    request<{ message: string; projectId: string }>('/api/projects/seed-demo', {
      method: 'POST',
    }),

  // Mentor
  getMentorMessages: (projectId: string) =>
    request<{ messages: MentorMessage[] }>(`/api/mentor/messages/${projectId}`),

  sendMentorMessage: (body: {
    projectId: string;
    message: string;
    currentStep?: string;
    projectContext?: string;
  }) =>
    request<{ reply: string; isDemoMode: boolean }>('/api/mentor/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Debugger
  diagnoseError: (body: {
    errorMessage: string;
    code?: string;
    currentStep?: string;
    projectContext?: string;
  }) =>
    request<{ diagnosis: DebugDiagnosis; isDemoMode: boolean }>('/api/debug', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
