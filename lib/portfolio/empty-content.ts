import { PortfolioContent, ResumeVersion } from "@/lib/portfolio/types"

export const emptyPortfolioContent: PortfolioContent = {
  hero: {
    eyebrow: "",
    name: "",
    title: "",
    description: "",
    primaryButtonLabel: "",
    secondaryButtonLabel: "",
    socialLinks: [],
  },
  about: {
    badge: "",
    title: "",
    description: "",
    imageUrl: "",
    imagePath: "",
    imageAlt: "",
    summaryTitle: "",
    summaryBody: "",
    traits: [],
    skillBadge: "",
    skillTitle: "",
    skills: [],
  },
  experience: {
    badge: "",
    title: "",
    items: [],
  },
  projects: {
    badge: "",
    title: "",
    description: "",
    otherProjectsTitle: "",
    otherProjectsBadge: "",
    items: [],
  },
  contact: {
    badge: "",
    title: "",
    description: "",
    formTitle: "",
    introTitle: "",
    introDescription: "",
    details: [],
    responseTimeTitle: "",
    responseTimeDescription: "",
  },
  footer: {
    name: "",
    tagline: "",
    socialLinks: [],
  },
}

export const emptyResumeVersions: ResumeVersion[] = []
