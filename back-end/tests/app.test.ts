import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from '../src/database.js';
import * as factory from './factories/recommendations.factory.js';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
});

afterAll(async () => {
    await prisma.$disconnect();
});

const server = supertest(app);

describe('POST /recommendations', () => {
    it.todo("Expected statusCode 201 when register a valid music");
    //inserir no de cima e checar se está lá após checar o statusCode 201;

    it.todo("Expected statusCode 409 when music already register")
    //Precisa ser unico - test com repetido - 409
});

describe('POST /recommendations/:id/upvote', ()=> {
    it.todo("Expected statusCode 200 when upvote successfully");
    //alem de retornar 200, checar se aumentou mesmo

    it.todo("Expected statusCode 404 when not found music id");
    //Se enviar um id invalido, dá erro 404 (not found)    
});

describe('POST /recommendations/:id/downvote', ()=> {
    it.todo("Expected statusCode 200 when downvote successfully");
    //alem de retornar 200, checar se diminuiu mesmo

    it.todo("Expected statusCode 404 when not found music id");
    //Se enviar um id invalido, dá erro 404 (not found)

    it.todo("Expected statusCode 200 and remove music recommendation when downvote below -5");
    //se pontuação abaixo de -5, deve excluir ela;
});

describe('GET /recommendations', ()=> {
    it.todo("Expected statusCode 200 and a list of music recommendations");
    //retorna as ultimas 10 reccomendations
});

describe('GET /recommendations/:id', ()=> {
    it.todo("Expected statusCode 200 and a recommendation with same ID");
    //precisa achar a reccomendations com aquela ID

    it.todo("Expected statusCode 404 when not found the recommendation");
    //não acha a recomendação
});

describe('GET /recommendations/random', ()=> {
    //precisa testar as porcentagens?


    it.todo("Expected statusCode 404 when recommendation list is empty");
});

describe('GET /recommendations/top/:amount', ()=> {
    it.todo("Expected statusCode 200 and a recommendation list with order descendent and amount size");


});