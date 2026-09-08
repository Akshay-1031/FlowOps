const {
  sendTaskCompletedWebhook,
} = require("./webhookService");

describe("sendTaskCompletedWebhook", () => {
  const originalFetch = global.fetch;
  const originalWebhookUrl = process.env.WEBHOOK_URL;

  afterEach(() => {
    global.fetch = originalFetch;

    if (originalWebhookUrl === undefined) {
      delete process.env.WEBHOOK_URL;
    } else {
      process.env.WEBHOOK_URL = originalWebhookUrl;
    }
  });

  test("sends a task.completed webhook successfully", async () => {
    process.env.WEBHOOK_URL =
      "https://example.com/webhook";

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    const task = {
      id: 10,
      title: "Build authentication",
      description: "Implement JWT authentication",
      priority: "HIGH",
      status: "DONE",
    };

    const project = {
      id: 11,
      name: "FlowOps",
    };

    const result =
      await sendTaskCompletedWebhook(
        task,
        project
      );

    expect(result).toBe(true);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/webhook",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const requestBody =
      JSON.parse(
        global.fetch.mock.calls[0][1].body
      );

    expect(requestBody.event).toBe(
      "task.completed"
    );

    expect(requestBody.task.title).toBe(
      "Build authentication"
    );

    expect(requestBody.task.status).toBe(
      "DONE"
    );

    expect(requestBody.project.name).toBe(
      "FlowOps"
    );
  });

  test("returns false when webhook delivery fails", async () => {
    process.env.WEBHOOK_URL =
      "https://example.com/webhook";

    global.fetch = jest
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 500,
      });

    const result =
      await sendTaskCompletedWebhook(
        {
          id: 10,
          title: "Test task",
          description: "",
          priority: "MEDIUM",
          status: "DONE",
        },
        {
          id: 11,
          name: "FlowOps",
        }
      );

    expect(result).toBe(false);
  });

  test("returns false when webhook request throws an error", async () => {
    process.env.WEBHOOK_URL =
      "https://example.com/webhook";

    global.fetch = jest
      .fn()
      .mockRejectedValue(
        new Error("Network failure")
      );

    const result =
      await sendTaskCompletedWebhook(
        {
          id: 10,
          title: "Test task",
          description: "",
          priority: "MEDIUM",
          status: "DONE",
        },
        {
          id: 11,
          name: "FlowOps",
        }
      );

    expect(result).toBe(false);
  });

  test("does not make a request when webhook URL is missing", async () => {
    delete process.env.WEBHOOK_URL;

    global.fetch = jest.fn();

    const result =
      await sendTaskCompletedWebhook(
        {
          id: 10,
          title: "Test task",
          description: "",
          priority: "MEDIUM",
          status: "DONE",
        },
        {
          id: 11,
          name: "FlowOps",
        }
      );

    expect(result).toBeUndefined();

    expect(global.fetch).not.toHaveBeenCalled();
  });
});