async function sendTaskCompletedWebhook(task, project) {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("WEBHOOK_URL is not configured.");
    return;
  }

  const payload = {
    event: "task.completed",
    timestamp: new Date().toISOString(),

    task: {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    },

    project: {
      id: project.id,
      name: project.name,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `Webhook failed with status ${response.status}`
      );

      return false;
    }

    console.log(
      `Webhook sent successfully for completed task ${task.id}`
    );

    return true;
  } catch (error) {
    console.error(
      "Webhook delivery error:",
      error.message
    );

    return false;
  }
}

module.exports = {
  sendTaskCompletedWebhook,
};