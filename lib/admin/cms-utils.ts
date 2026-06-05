import type {
  AboutTrait,
  ExperienceProject,
  ProjectItem,
  SkillCategory,
  SocialLink,
} from "@/lib/portfolio/types"

export const newSocialLink: SocialLink = { label: "New Link", href: "https://" }
export const newTrait: AboutTrait = { title: "New Trait", description: "Describe it" }
export const newSkill: SkillCategory = { title: "New Skill", description: "Describe it", technologies: ["Example"] }
export const newExperienceProject: ExperienceProject = { title: "Project", description: "Project details" }

export function createProject(): ProjectItem {
  return {
    title: "New Project",
    description: "Describe the project",
    image: "",
    imagePath: `portfolio/images/projects/${Date.now()}-project.png`,
    technologies: ["Tech"],
    liveUrl: "https://",
    githubUrl: "https://",
    featured: false,
    stats: { stars: "Label", views: "Label" },
    achievement: "",
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".")
  return lastDot === -1 ? "" : fileName.slice(lastDot)
}

export function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function joinCommaList(values: string[]) {
  return values.join(", ")
}

export function updateAt<T>(items: T[], index: number, updater: (item: T) => T) {
  return items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item))
}

export function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

export function describeSource(source: "firestore" | "local-default") {
  return source === "firestore" ? "Firestore" : "Local fallback"
}

export function formatDate(ms?: number) {
  if (!ms) {
    return "Not saved yet"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(ms)
}
