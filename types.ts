
export enum Branch {
  COMPUTER = 'Computer Science',
  IT = 'Information Technology',
  ELECTRONICS = 'Electronics & Communication',
  MECHANICAL = 'Mechanical Engineering',
  CIVIL = 'Civil Engineering',
  ELECTRICAL = 'Electrical Engineering'
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface UserPreferences {
  semester: string;
  branch: Branch;
  domain: string;
  skillLevel: SkillLevel;
}

export interface ProjectSummary {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suitability: string;
}

export interface TechStackItem {
  category: string;
  items: string[];
}

export interface RoadmapStep {
  week: string;
  task: string;
  details: string[];
}

export interface ResourceItem {
  title: string;
  type: 'Video' | 'Documentation' | 'Course' | 'Repo';
  link: string;
}

export interface VivaPrep {
  questions: string[];
  concepts: string[];
  mistakes: string[];
  evaluatorExpectations: string[];
}

export interface ProjectDeepDive {
  title: string;
  intro: string;
  fullDescription: string;
  techStack: TechStackItem[];
  roadmap: RoadmapStep[];
  resources: ResourceItem[];
  vivaPrep: VivaPrep;
  presentationTips: string[];
  closing: string;
}

// Added MentorOutput interface to fix the module export error in components/ProjectMentorOutput.tsx
export interface MentorOutput {
  intro: string;
  projectIdeas: {
    title: string;
    description: string;
    difficulty: string;
    suitability: string;
  }[];
  techStack: TechStackItem[];
  roadmap: RoadmapStep[];
  vivaPrep: VivaPrep;
  closing: string;
}
