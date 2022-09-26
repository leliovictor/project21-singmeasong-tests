import * as factory from "../factories/recommendation.factory.js";

beforeEach(() => {
  cy.eraseDatabase();
});

describe("Add new recommendation", () => {
  const recommendation = factory.createRecommendationData();
  const url = "http://localhost:3000/";

  it("Expect add song with valid body", () => {
    cy.visit(url);
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 201);
    cy.get('[data-cy="musicName"]').should("be.visible");
  });

  it("Expect not add song when music name is already in use", () => {
    cy.visit(url);

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });

    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );

    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 409);
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Error creating recommendation!");
    });
  });

  it("Expect not add song and alert when invalid body", () => {
    cy.visit(url);
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "postRecommendation"
    );
    cy.get('[data-cy="submit"]').click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Error creating recommendation!");
    });
    cy.wait("@postRecommendation").its("response.statusCode").should("eq", 422);
  });
});

describe("Voting recommendation", () => {
  const url = "http://localhost:3000/";

  it("Expect upvote a recommendation", ()=> {
    const recommendation = factory.createRecommendationData();
    cy.request("POST", "http://localhost:5000/recommendations", {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });

    cy.visit(url);
    cy.get('[data-cy="upvote"]').click();
  
    cy.wait(1000);

    cy.get('[data-cy="score"]').invoke('text').then(parseInt).should('be.gt', 0);
  });

  it("Expect downvote a recommendation", ()=> {
    const recommendation = factory.createRecommendationData();
    cy.request("POST", "http://localhost:5000/recommendations", {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });

    cy.visit(url);
    cy.get('[data-cy="downvote"]').click();
  
    cy.wait(1000);

    cy.get('[data-cy="score"]').invoke('text').then(parseInt).should('be.lt', 0);
  });

  it("Expect delete a element after downvote a recommendation with score <-5", ()=> {
    const recommendation = factory.createRecommendationData();

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });

    cy.visit(url);
    cy.get('[data-cy="downvote"]').click();
    cy.get('[data-cy="downvote"]').click();
    cy.get('[data-cy="downvote"]').click();
    cy.get('[data-cy="downvote"]').click();
    cy.get('[data-cy="downvote"]').click();
    cy.get('[data-cy="downvote"]').click();
  
    cy.wait(1000);

    cy.get('[data-cy="musicName"]').should("not.exist");
  });
});

describe("Header Random Menu", ()=> {
  const url = "http://localhost:3000/";

  it("Expect see a random recommendation", ()=> {
    const recommendation = factory.createRecommendationData();

    cy.request("POST", "http://localhost:5000/recommendations", {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });
    cy.visit(url + "random");
    cy.get('[data-cy="musicName"]').should("be.visible");
  });
});
