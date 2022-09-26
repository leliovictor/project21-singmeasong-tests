import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

import * as factory from "../factories/recommendations.factory.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";

jest.mock("../../src/repositories/recommendationRepository.js");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Tests about post a new recommendation", () => {
  it("Expect insert a new recommendation", async () => {
    const recommendation = factory.createDataRecommendation();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementation((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementation((): any => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.findByName).toHaveBeenCalled();
    expect(recommendationRepository.create).toHaveBeenCalled();
  });

  it("Expect throw error with recommendation name already in use", () => {
    const recommendation = factory.createDataRecommendation();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementation((): any => {
        return true;
      });

    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
  });
});

describe("Test about vote a recommendation", ()=> {

  it("Expect upvote recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {});
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return true;
    });

    await recommendationService.upvote(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });

  it("Expect downvote recommendation without erase", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {
        return { score: 0 };
      });
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return true;
    });

    await recommendationService.downvote(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });

  it("Expect downvote recommendation and erase recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {
        return { score: -6 };
      });
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return true;
    });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementation((): any => {});

    await recommendationService.downvote(2);
    expect(recommendationRepository.remove).toHaveBeenCalled();
  });

  it("Expect error if recommendation doesn't exist", async () => {
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementation((): any => {});
    jest.spyOn(recommendationRepository, "find").mockImplementation((): any => {
      return false;
    });

    const promise = recommendationService.upvote(1);
    expect(promise).rejects.toEqual(notFoundError());
  });
});

describe("Tests about get recommendations", ()=> {
  it("Expect get all recommendation from database", async ()=> {
    jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => {});
    await recommendationService.get();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
  });

  it("Expect get top recommendations from database", async ()=> {
    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementation((): any => {});
    await recommendationService.getTop(2);
    expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
  });
});