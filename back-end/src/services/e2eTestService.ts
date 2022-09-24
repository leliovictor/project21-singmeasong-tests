import {recommendationRepository} from "../repositories/recommendationRepository.js";

export async function eraseDatabase() {
    await recommendationRepository.reset();
}