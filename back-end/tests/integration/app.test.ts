import supertest from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import * as factory from "../factories/recommendations.factory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

const server = supertest(app);

describe("POST /recommendations", () => {
  it("Expected statusCode 201 when register a valid music", async () => {
    const body = factory.createDataRecommendation();

    const { statusCode } = await server.post("/recommendations").send(body);
    const createdRecommendation = await prisma.recommendation.findFirst({
      where: body,
    });

    expect(statusCode).toBe(201);
    expect(createdRecommendation).not.toBeNull();
  });

  it("Expected statusCode 409 when music already register", async () => {
    const body = factory.createDataRecommendation();

    await factory.insertRecommendation(body);

    const { statusCode } = await server.post("/recommendations").send(body);
    expect(statusCode).toBe(409);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("Expected statusCode 200 when upvote successfully", async () => {
    const body = factory.createDataRecommendation();
    await factory.insertRecommendation(body);

    const { statusCode } = await server.post("/recommendations/1/upvote");
    const { score } = await prisma.recommendation.findFirst({ where: body });

    expect(statusCode).toBe(200);
    expect(score).toBe(1);
  });

  it("Expected statusCode 404 when not found music id", async () => {
    const { statusCode } = await server.post("/recommendations/1/upvote");
    expect(statusCode).toBe(404);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("Expected statusCode 200 when downvote successfully", async () => {
    const body = factory.createDataRecommendation();
    await factory.insertRecommendation(body);

    const { statusCode } = await server.post("/recommendations/1/downvote");
    const { score } = await prisma.recommendation.findFirst({ where: body });

    expect(statusCode).toBe(200);
    expect(score).toBe(-1);
  });

  it("Expected statusCode 404 when not found music id", async () => {
    const { statusCode } = await server.post("/recommendations/1/downvote");
    expect(statusCode).toBe(404);
  });

  it("Expected statusCode 200 and remove music recommendation when downvote below -5", async () => {
    const body = factory.createDataRecommendation();

    const data = { ...body, score: -5 };
    await prisma.recommendation.create({ data });

    const { statusCode } = await server.post("/recommendations/1/downvote");
    const recommendation = await prisma.recommendation.findFirst({
      where: body,
    });

    expect(statusCode).toBe(200);
    expect(recommendation).toBeNull();
  });
});

describe("GET /recommendations", () => {
  it("Expected statusCode 200 and a list of music recommendations", async () => {
    const ListLength = 12;
    await factory.createScenarioListOfRecommendations(ListLength);

    const MaxReturnLength = ListLength > 10 ? 10 : ListLength;
    const arrayRecommendation = await prisma.recommendation.findMany({
      take: MaxReturnLength,
      orderBy: { id: "desc" },
    });

    const { statusCode, body } = await server.get("/recommendations");

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(MaxReturnLength);
    expect(body).toEqual(arrayRecommendation);
  });
});

describe("GET /recommendations/:id", () => {
  it("Expected statusCode 200 and a recommendation with same ID", async () => {
    const body = factory.createDataRecommendation();
    await factory.insertRecommendation(body);

    const recommendation = await prisma.recommendation.findFirst({
      where: body,
    });

    const { statusCode, body: result } = await server.get(
      `/recommendations/${recommendation.id}`
    );

    expect(statusCode).toBe(200);
    expect(result).toEqual(recommendation);
  });

  it("Expected statusCode 404 when not found the recommendation", async () => {
    const { statusCode } = await server.get("/recommendations/1");
    expect(statusCode).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("Expected statusCode 200 and a random recommendation", async () => {

    await factory.createScenarioListOfRecommendationsWithRandomScore(10);

    const { statusCode, body } = await server.post("/recommendations/random");

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('youtubeLink');

    //there is a bug at this router - always 404 error;
  });

  it("Expected statusCode 404 when recommendation list is empty", async () => {
    const { statusCode } = await server.get("/recommendations/random");
    expect(statusCode).toBe(404);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("Expected statusCode 200 and a recommendation list with order descendent and amount size", async () => {
    const Amount = 12;
    const PlusAmountToPopulateDB = 4;
    const length = Amount + PlusAmountToPopulateDB;

    await factory.createScenarioListOfRecommendationsWithRandomScore(length);

    const arrayRecommendation = await prisma.recommendation.findMany({
      take: Amount,
      orderBy: { score: "desc" },
    });

    const { statusCode, body } = await server.get(
      `/recommendations/top/${Amount}`
    );

    expect(statusCode).toBe(200);
    expect(body).toHaveLength(Amount);
    expect(body).toEqual(arrayRecommendation);
  });
});
