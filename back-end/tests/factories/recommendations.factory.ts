import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

export function createDataRecommendation() {
  const name = faker.music.songName();
  const youtubeLink =
    "https://www.youtube.com/watch?v=zYnGTt701t8&ab_channel=NinaOliveira";

  const body = { name, youtubeLink };

  return body;
}

export async function insertRecommendation(data: CreateRecommendationData) {
  return await prisma.recommendation.create({ data });
}

export async function createScenarioListOfRecommendations(length: number = 2) {
  for (let i = 0; i < length; i++) {
    const data = createDataRecommendation();
    await insertRecommendation(data);
  }
}

export async function createScenarioListOfRecommendationsWithRandomScore(length: number = 2) {
  for (let i = 0; i < length; i++) {
    const body = createDataRecommendation();
    const score = Math.floor(Math.random() * 24) - 4;
    const data = {...body, score};

    await insertRecommendation(data);
  }
}
