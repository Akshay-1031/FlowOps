const { db } = require("../prisma/db.ts");

async function createProject(req, res) {
    try {
        const { name, description } = req.body;
        const ownerId = req.user.userId;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required",
            });
        }

        const project = await db.orm.public.Project.create({
            name,
            description,
            ownerId,
        });

        await db.orm.public.ProjectMember.create({
            userId: ownerId,
            projectId: project.id,
            role: "OWNER",
        });

        return res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function getProjects(req, res) {
    try {
        const userId = req.user.userId;

        const projects = await db.orm.public.Project
            .where({ ownerId: userId })
            .all();

        return res.status(200).json({
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function getProject(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = Number(req.params.id);

        if (Number.isNaN(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const project = await db.orm.public.Project
            .where({
                id: projectId,
                ownerId: userId,
            })
            .first();

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        return res.status(200).json({
            project,
        });
    } catch (error) {
        console.error("Get project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function updateProject(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = Number(req.params.id);
        const { name, description } = req.body;

        if (Number.isNaN(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Project name is required",
            });
        }

        const project = await db.orm.public.Project
            .where({
                id: projectId,
                ownerId: userId,
            })
            .first();

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const updatedProject = await db.orm.public.Project
            .where({ id: projectId })
            .update({
                name,
                description,
            });

        return res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Update project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function deleteProject(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = Number(req.params.id);

        if (Number.isNaN(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const project = await db.orm.public.Project
            .where({
                id: projectId,
                ownerId: userId,
            })
            .first();

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        await db.orm.public.ProjectMember
            .where({ projectId })
            .delete();

        await db.orm.public.Project
            .where({ id: projectId })
            .delete();

        return res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject, };