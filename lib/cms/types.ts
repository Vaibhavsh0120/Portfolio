export interface SocialLink {
  label: string
  href: string
}

export interface HeroContent {
  eyebrow: string
  name: string
  title: string
  description: string
  primaryButtonLabel: string
  secondaryButtonLabel: string
  socialLinks: SocialLink[]
}

export interface AboutTrait {
  title: string
  description: string
}

export interface SkillCategory {
  title: string
  description: string
  technologies: string[]
}

export interface AboutContent {
  badge: string
  title: string
  description: string
  imageUrl: string
  imagePath: string
  imageAlt: string
  summaryTitle: string
  summaryBody: string
  traits: AboutTrait[]
  skillBadge: string
  skillTitle: string
  skills: SkillCategory[]
}

export interface ExperienceProject {
  title: string
  description: string
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  projects: ExperienceProject[]
  technologies: string[]
}

export interface ExperienceContent {
  badge: string
  title: string
  items: ExperienceItem[]
}

export interface ProjectStats {
  stars: string
  views: string
}

export interface ProjectItem {
  title: string
  description: string
  image: string
  imagePath: string
  technologies: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  stats: ProjectStats
  achievement?: string
}

export interface ProjectsContent {
  badge: string
  title: string
  description: string
  otherProjectsTitle: string
  otherProjectsBadge: string
  items: ProjectItem[]
}

export interface ContactDetail {
  title: string
  content: string
  href: string
  description: string
}

export interface ContactContent {
  badge: string
  title: string
  description: string
  formTitle: string
  introTitle: string
  introDescription: string
  details: ContactDetail[]
  responseTimeTitle: string
  responseTimeDescription: string
}

export interface FooterContent {
  name: string
  tagline: string
  socialLinks: SocialLink[]
}

export interface PortfolioContent {
  hero: HeroContent
  about: AboutContent
  experience: ExperienceContent
  projects: ProjectsContent
  contact: ContactContent
  footer: FooterContent
  updatedAtMs?: number
}

export interface ResumeVersion {
  id?: string
  label: string
  fileName: string
  downloadUrl: string
  storagePath: string
  isCurrent: boolean
  createdAtMs: number
  note: string
}

export type PortfolioDataSource = "firestore" | "local-default" | "cloudinary"

export interface PortfolioBundleMeta {
  contentSource: PortfolioDataSource
  resumeSource: PortfolioDataSource
}

export interface PortfolioBundle {
  content: PortfolioContent
  resumes: ResumeVersion[]
  meta: PortfolioBundleMeta
}
