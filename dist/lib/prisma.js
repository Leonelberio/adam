"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var globalForPrisma = global;
var prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: ["query"], // Optional: Logs queries for debugging in development
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
exports.default = prisma;
