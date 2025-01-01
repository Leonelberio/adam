"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var countries, _i, countries_1, country, usCountry, frCountry, user1, user2, categories, _a, categories_1, category, techCategory, financeCategory;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Seeding initial data...");
                    countries = [
                        { name: "United States", code: "US" },
                        { name: "France", code: "FR" },
                        { name: "Germany", code: "DE" },
                    ];
                    _i = 0, countries_1 = countries;
                    _b.label = 1;
                case 1:
                    if (!(_i < countries_1.length)) return [3 /*break*/, 4];
                    country = countries_1[_i];
                    return [4 /*yield*/, prisma_1.default.country.upsert({
                            where: { code: country.code },
                            update: {},
                            create: country,
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, prisma_1.default.country.findUnique({ where: { code: "US" } })];
                case 5:
                    usCountry = _b.sent();
                    return [4 /*yield*/, prisma_1.default.country.findUnique({ where: { code: "FR" } })];
                case 6:
                    frCountry = _b.sent();
                    return [4 /*yield*/, prisma_1.default.user.upsert({
                            where: { email: "john.doe@example.com" },
                            update: {},
                            create: {
                                name: "John Doe",
                                email: "john.doe@example.com",
                                countryId: usCountry === null || usCountry === void 0 ? void 0 : usCountry.id,
                            },
                        })];
                case 7:
                    user1 = _b.sent();
                    return [4 /*yield*/, prisma_1.default.user.upsert({
                            where: { email: "jane.smith@example.com" },
                            update: {},
                            create: {
                                name: "Jane Smith",
                                email: "jane.smith@example.com",
                                countryId: frCountry === null || frCountry === void 0 ? void 0 : frCountry.id,
                            },
                        })];
                case 8:
                    user2 = _b.sent();
                    categories = ["Technology", "Finance", "Healthcare"];
                    _a = 0, categories_1 = categories;
                    _b.label = 9;
                case 9:
                    if (!(_a < categories_1.length)) return [3 /*break*/, 12];
                    category = categories_1[_a];
                    return [4 /*yield*/, prisma_1.default.category.upsert({
                            where: { name: category },
                            update: {},
                            create: { name: category },
                        })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12: return [4 /*yield*/, prisma_1.default.category.findUnique({
                        where: { name: "Technology" },
                    })];
                case 13:
                    techCategory = _b.sent();
                    return [4 /*yield*/, prisma_1.default.category.findUnique({
                            where: { name: "Finance" },
                        })];
                case 14:
                    financeCategory = _b.sent();
                    // Add example cards with position
                    return [4 /*yield*/, prisma_1.default.card.createMany({
                            data: [
                                {
                                    content: "Exploring the future of AI",
                                    creatorId: user1.id,
                                    countryId: usCountry === null || usCountry === void 0 ? void 0 : usCountry.id,
                                    categoryId: techCategory === null || techCategory === void 0 ? void 0 : techCategory.id,
                                    likes: 10,
                                    reports: 0,
                                    positionX: 100, // Card position on the X-axis
                                    positionY: 200, // Card position on the Y-axis
                                },
                                {
                                    content: "Understanding blockchain in finance",
                                    creatorId: user2.id,
                                    countryId: frCountry === null || frCountry === void 0 ? void 0 : frCountry.id,
                                    categoryId: financeCategory === null || financeCategory === void 0 ? void 0 : financeCategory.id,
                                    likes: 8,
                                    reports: 1,
                                    positionX: 300,
                                    positionY: 150,
                                },
                                {
                                    content: "Breakthroughs in modern medicine",
                                    creatorId: user1.id,
                                    countryId: usCountry === null || usCountry === void 0 ? void 0 : usCountry.id,
                                    categoryId: techCategory === null || techCategory === void 0 ? void 0 : techCategory.id,
                                    likes: 15,
                                    reports: 0,
                                    positionX: 500,
                                    positionY: 100,
                                },
                            ],
                        })];
                case 15:
                    // Add example cards with position
                    _b.sent();
                    console.log("Seeding complete!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return prisma_1.default.$disconnect(); });
