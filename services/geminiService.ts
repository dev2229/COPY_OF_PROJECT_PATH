
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, ProjectSummary, ProjectDeepDive, SkillLevel } from "../types.ts";

function robustJsonParse(text: string): any {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```json\s*|\s*```$/g, "");
  }
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error("JSON Parse Error. Raw content:", text);
    throw new Error("The blueprint generation was interrupted. Please try again.");
  }
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateProjectSummaries(
  prefs: UserPreferences
): Promise<ProjectSummary[]> {
  const ai = getAiClient();

  const difficultyMap: Record<string, string> = {
    [SkillLevel.BEGINNER]: 'Easy',
    [SkillLevel.INTERMEDIATE]: 'Medium',
    [SkillLevel.ADVANCED]: 'Hard'
  };
  const targetDifficulty = difficultyMap[prefs.skillLevel] || 'Medium';

  const prompt = `
You are the "ProjectPath Senior Academic Mentor". Your mission is to help a ${prefs.semester}th-semester ${prefs.branch} student succeed.
Domain: ${prefs.domain}
Student Skill Level: ${prefs.skillLevel} (Target Difficulty: ${targetDifficulty})

STRICT INSTRUCTIONS:
1. Generate 4 unique, industry-relevant project ideas.
2. Every single project MUST be categorized as "${targetDifficulty}" difficulty.
3. Each "suitability" field must explain the specific pedagogical value for a student at this exact stage of their engineering degree.
4. Keep "shortDescription" under 12 words, using punchy engineering terminology.

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
            difficulty: { type: Type.STRING },
            suitability: { type: Type.STRING }
          },
          required: ["id", "title", "shortDescription", "difficulty", "suitability"]
        }
      }
    }
  });

  return robustJsonParse(response.text);
}

export async function generateProjectDeepDive(
  summary: ProjectSummary,
  prefs: UserPreferences
): Promise<ProjectDeepDive> {
  const ai = getAiClient();

  const prompt = `
As the ProjectPath Senior Mentor, provide a comprehensive Technical Blueprint for: "${summary.title}".
Student Background: Semester ${prefs.semester}, ${prefs.branch}, ${prefs.skillLevel} level.

Focus on:
- Production-grade architecture.
- A 6-8 week "Sprint-based" roadmap.
- High-stakes Viva (oral exam) preparation.

Return JSON:
{
  "title": "${summary.title}",
  "intro": "Mentor's overview of why this project matters in the current industry.",
  "fullDescription": "Deep technical objective and architectural vision (2 paragraphs).",
  "techStack": [{"category": "string", "items": ["string"]}],
  "roadmap": [{"week": "Week X", "task": "Heading", "details": ["Technical sub-task 1", "2", "3"]}],
  "resources": [{"title": "string", "type": "Video|Repo|Doc", "link": "string"}],
  "vivaPrep": {
    "questions": ["High-level conceptual question", "Implementation detail question", "Scenario-based question", "Optimization question", "Security/Scaling question"],
    "concepts": ["Keyword 1", "Keyword 2", ...],
    "mistakes": ["Common error 1", ...],
    "evaluatorExpectations": ["Expectation 1", ...]
  },
  "presentationTips": ["Presentation Tip 1", ...],
  "closing": "Final words of encouragement from the Mentor."
}
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
          vivaPrep: {
            type: Type.OBJECT,
            properties: {
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              evaluatorExpectations: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          closing: { type: Type.STRING }
        }
      }
    }
  });

  return robustJsonParse(response.text);
}
