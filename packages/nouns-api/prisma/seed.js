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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const chance_1 = __importDefault(require("chance"));
const prisma = new client_1.PrismaClient();
const chance = new chance_1.default();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = {
            id: 1,
            wallet: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
            ens: 'test.eth',
        };
        yield prisma.user.create({ data: user });
        for (let i = 0; i < 5; i++) {
            yield prisma.idea.create({
                data: {
                    title: chance.word({ length: 5 }),
                    tldr: chance.sentence(),
                    description: chance.sentence(),
                    creatorId: user.wallet,
                },
            });
        }
    });
}
seed();
