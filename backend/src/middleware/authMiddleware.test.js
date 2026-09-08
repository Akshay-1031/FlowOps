const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./authMiddleware");

describe("authenticateToken", () => {
    beforeAll(() => {
        process.env.JWT_SECRET = "test-secret";
    });

    test("allows request with a valid token", () => {
        const token = jwt.sign(
            {
                userId: 8,
                role: "MEMBER",
            },
            process.env.JWT_SECRET
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user.userId).toBe(8);
        expect(req.user.role).toBe("MEMBER");
    });

    test("rejects request without a token", () => {
        const req = {
            headers: {},
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("rejects request with an invalid token", () => {
        const req = {
            headers: {
                authorization: "Bearer invalid-token",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});