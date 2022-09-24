import * as factory from "../factories/recommendation.factory.js";

beforeEach(()=> {
  cy.eraseDatabase();
});

describe("Add new recommendation", () => {
  const recommendation = factory.createRecommendationData();

  it("Expect add song", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="password"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    //continuar;
  });
});
