const { GoogleGenAI } = require("@google/genai");
const { db } = require("../prisma/db.ts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeProject(req, res) {
  try {
    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    console.log(
      `AI analysis requested for project ${projectId}`
    );

    if (Number.isNaN(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    // 1. Verify that the logged-in user owns the project
    console.log("Checking project ownership...");

    const project = await db.orm.public.Project.where({
      id: projectId,
      ownerId: userId,
    }).first();

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    console.log(`Project found: ${project.name}`);

    // 2. Fetch project tasks
    console.log("Fetching project tasks...");

    const tasks = await db.orm.public.Task.where({
      projectId,
    }).all();

    console.log(`Found ${tasks.length} tasks`);

    // 3. Handle projects with no tasks
    if (tasks.length === 0) {
      return res.status(200).json({
        project: {
          id: project.id,
          name: project.name,
        },
        analysis: {
          summary:
            "This project does not have any tasks yet.",
          priorities: [],
          bottlenecks: [],
          nextActions: [
            "Create the first task for this project.",
          ],
        },
      });
    }

    // 4. Only send relevant task information to the AI
    const taskData = tasks.map((task) => ({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
    }));

    const prompt = `
You are FlowOps AI, a productivity intelligence system
inside a project management application.

Analyze this project and its tasks.

PROJECT:
Name: ${project.name}

Description:
${project.description || "No description"}

TASKS:
${JSON.stringify(taskData, null, 2)}

Analyze the current state of the project.

Identify:
1. Which unfinished tasks deserve the most attention.
2. Potential bottlenecks.
3. Concrete next actions.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "1-2 sentence summary of the project's current state.",
  "priorities": [
    {
      "task": "Exact task title from the provided tasks",
      "reason": "Why this task deserves attention",
      "urgency": "HIGH"
    }
  ],
  "bottlenecks": [
    "Potential blocker or bottleneck"
  ],
  "nextActions": [
    "Concrete recommended action"
  ]
}

Rules:
- Prioritize unfinished tasks.
- Consider task priority and current status.
- Never invent tasks.
- Use exact task titles from the input.
- Maximum 3 priority recommendations.
- Maximum 3 bottlenecks.
- Maximum 3 next actions.
- Keep recommendations practical.
- Return JSON only.
`;

    // 5. Ask Gemini for the analysis
    console.log("Sending project data to Gemini...");

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
      generation_config: {
        thinking_level: "low",
      },
    });

    console.log("Gemini response received");

    const output = interaction.output_text;

    if (!output) {
      console.error("Gemini returned no text");

      return res.status(502).json({
        message: "AI returned an empty response",
      });
    }

    console.log("Parsing AI response...");

    let analysis;

    try {
      analysis = JSON.parse(output);
    } catch (parseError) {
      console.error(
        "AI returned invalid JSON:",
        output
      );

      return res.status(502).json({
        message: "AI returned an invalid analysis format",
      });
    }

    // 6. Return clean response to frontend
    return res.status(200).json({
      project: {
        id: project.id,
        name: project.name,
      },
      analysis,
    });
  } catch (error) {
    console.error("AI project analysis error:", error);

    return res.status(500).json({
      message: "Unable to analyze project",
    });
  }
}

module.exports = {
  analyzeProject,
};