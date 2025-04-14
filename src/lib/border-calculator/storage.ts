import { LocalStorage } from "@raycast/api"
import { BorderTemplate, BorderPreferences, DEFAULT_PREFERENCES } from "./types"
import { calculateBorderTemplate } from "./calculations"
import { saveTemplateImage, deleteTemplateImage } from "./svg-renderer"

const TEMPLATES_KEY = "border-calculator-templates"
const PREFERENCES_KEY = "border-calculator-preferences"

export async function getTemplates(): Promise<BorderTemplate[]> {
  const templates = await LocalStorage.getItem<string>(TEMPLATES_KEY)
  return templates ? JSON.parse(templates) : []
}

export async function saveTemplate(template: BorderTemplate): Promise<void> {
  const templates = await getTemplates()
  const existingIndex = templates.findIndex(t => t.id === template.id)
  
  if (existingIndex >= 0) {
    templates[existingIndex] = template
  } else {
    templates.push(template)
  }
  
  await LocalStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  
  try {
    // Generate and cache SVG for the template
    const calculation = calculateBorderTemplate(template)
    await saveTemplateImage(template, calculation)
  } catch (error) {
    console.error(`Failed to generate template image for "${template.name}":`, error)
    // We don't want to fail the template save if image generation fails
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  const templates = await getTemplates()
  const filteredTemplates = templates.filter(t => t.id !== id)
  await LocalStorage.setItem(TEMPLATES_KEY, JSON.stringify(filteredTemplates))
  
  // Try to delete the template image from cache
  deleteTemplateImage(id)
}

export async function searchTemplates(query: string): Promise<BorderTemplate[]> {
  const templates = await getTemplates()
  const lowerQuery = query.toLowerCase()
  
  return templates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery)
  )
}

export async function getPreferences(): Promise<BorderPreferences> {
  const prefs = await LocalStorage.getItem<string>(PREFERENCES_KEY)
  return prefs ? JSON.parse(prefs) : DEFAULT_PREFERENCES
}

export async function savePreferences(preferences: BorderPreferences): Promise<void> {
  await LocalStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
} 