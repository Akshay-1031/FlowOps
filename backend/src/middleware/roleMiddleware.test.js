const { requireRole } = require("./roleMiddleware");

describe("requireRole", () => {
    test("allows a user with the required role", () => {
        const req = {
            user: {
                userId: 8,
                role: "ADMIN",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        requireRole("ADMIN")(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("rejects a user without the required role", () => {
        const req = {
            user: {
                userId: 8,
                role: "MEMBER",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        requireRole("ADMIN")(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});