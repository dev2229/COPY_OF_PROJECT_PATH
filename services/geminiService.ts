
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, ProjectSummary, ProjectDeepDive, SkillLevel } from "../types.ts";

/**
 * Robustly parses and repairs JSON from Gemini model output.
 */
function robustJsonParse(text: string): any {
  let clean = text.trim();

  // Strip Markdown markers if present
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```json\s*|\s*```$/g, "");
  }

  // Simple auto-balancing for truncated JSON responses
  let openBraces = (clean.match(/\{/g) || []).length;
  let closeBraces = (clean.match(/\}/g) || []).length;
  while (openBraces > closeBraces) { clean += "}"; closeBraces++; }

  let openBrackets = (clean.match(/\[/g) || []).length;
  let closeBrackets = (clean.match(/\]/g) || []).length;
  while (openBrackets > closeBrackets) { clean += "]"; closeBrackets++; }

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error("JSON Parse Error. Raw content:", text);
    throw new Error("The AI returned a blueprint that was too complex to parse. Please try adjusting your parameters.");
  }
}

/**
 * Ensures the GoogleGenAI instance is created with the most recent API key.
 */
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Generates 4 tailored project ideas based on student preferences.
 * Now strictly enforces Difficulty based on Skill Level:
 * Beginner -> Easy
 * Intermediate -> Medium
 * Advanced -> Hard
 */
export async function generateProjectSummaries(
  prefs: UserPreferences
): Promise<ProjectSummary[]> {
  const ai = getAiClient();

  // Map SkillLevel to specific Difficulty string
  const difficultyMap: Record<string, string> = {
    [SkillLevel.BEGINNER]: 'Easy',
    [SkillLevel.INTERMEDIATE]: 'Medium',
    [SkillLevel.ADVANCED]: 'Hard'
  };
  const targetDifficulty = difficultyMap[prefs.skillLevel] || 'Medium';

  const prompt = `
You are a Senior Engineering Project Architect. Generate exactly 4 unique project ideas for a student:
- Semester: ${prefs.semester}
- Branch: ${prefs.branch}
- Domain: ${prefs.domain}
- Skill Level: ${prefs.skillLevel}

STRICT REQUIREMENT:
The project difficulty for all 4 ideas MUST be exactly "${targetDifficulty}". 
- Do NOT generate "Medium" or "Hard" projects for a Beginner.
- Do NOT generate "Easy" projects for an Advanced student.

Criteria:
- Must be academically rigorous for a group of 3-4 engineering students.
- Descriptions must be highly professional, technical, and under 15 words.
- "suitability" should explain why this specific project is appropriate for a ${prefs.semester}th-semester student at the ${prefs.skillLevel} level.

Return exactly 4 ideas in a JSON array.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        minItems: 4,
        maxItems: 4,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            difficulty: { 
              type: Type.STRING,
              description: `Must be exactly "${targetDifficulty}"`
            },
            suitability: { type: Type.STRING }
          },
          required: ["id", "title", "shortDescription", "difficulty", "suitability"]
        }
      }
    }
  });

  return robustJsonParse(response.text);
}

/**
 * Generates a deep-dive project roadmap and viva preparation guide.
 */
export async function generateProjectDeepDive(
  summary: ProjectSummary,
  prefs: UserPreferences
): Promise<ProjectDeepDive> {
  const ai = getAiClient();

  const prompt = `
Act as a Senior Project Architect. Provide a full technical blueprint for the project: "${summary.title}".

Academic Context: Semester ${prefs.semester}, ${prefs.branch}
Target Difficulty Level: ${summary.difficulty} (Skill Level: ${prefs.skillLevel})
Brief Objective: ${summary.shortDescription}

Return a JSON object containing:
1. intro: A 1-line encouraging architectural summary.
2. fullDescription: A detailed 2-paragraph technical objective covering architecture and goals.
3. techStack: Array of categories (e.g., Core Engine, Interface, Database) and specific professional tools/frameworks.
4. roadmap: A 6-8 week breakdown with tasks and 3 bullet points of technical sub-tasks each.
5. resources: 3 helpful learning assets/titles.
6. vivaPrep: 5 professional viva questions, 5 core engineering concepts, 3 common failure modes (mistakes), and 4 evaluator expectations.
7. presentationTips: 3 strategic tips for the final demonstration.
8. closing: A final 1-line motivating professional sign-off.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          intro: { type: Type.STRING },
          fullDescription: { type: Type.STRING },
          techStack: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.STRING },
                task: { type: Type.STRING },
                details: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                link: { type: Type.STRING }
              }
            }
          },
          vivaPrep: {
            type: Type.OBJECT,
            properties: {
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              evaluatorExpectations: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          presentationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          closing: { type: Type.STRING }
        },
        required: ["title", "intro", "fullDescription", "techStack", "roadmap", "vivaPrep", "closing"]
      }
    }
  });

  return robustJsonParse(response.text);
}
