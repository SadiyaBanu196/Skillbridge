export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface TechItem {
  technology: string;
  purpose: string;
  explanation?: string;
  whyAppropriate?: string;
}

export interface ComponentItem {
  name: string;
  description: string;
  purpose?: string;
  responsibilities?: string[];
  relationships?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  whyNeeded?: string;
  concepts: string[];
  instructions?: string[];
  deliverable: string;
  estimatedTime: string;
}

export interface RoadmapPhase {
  name: string;
  description: string;
  steps: RoadmapStep[];
}

export interface ProjectPlan {
  overview: {
    problem: string;
    solution: string;
    objective: string;
  };
  techStack: TechItem[];
  components: ComponentItem[];
  phases: RoadmapPhase[];
}

export interface ProjectStats {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
  isCompleted: boolean;
  currentStep: {
    id: string;
    title: string;
    phaseName: string;
  } | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  difficulty?: string;
  language?: string;
  plan: ProjectPlan;
  progressMap?: Record<string, { completed: boolean; completedAt: string | null }>;
  stats?: ProjectStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  language: string;
  techStack: TechItem[];
  createdAt: string;
  updatedAt: string;
  stats: ProjectStats;
}

export interface MentorMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface DebugDiagnosis {
  problem: string;
  cause: string;
  solution: string;
  nextAction: string;
}
