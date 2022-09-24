import { faker } from "@faker-js/faker";

export function createRecommendationData() {
    const name = faker.music.songName();
    const youtubeLink = "https://www.youtube.com/watch?v=jr47YisIsz8&ab_channel=DuaLipa";

    return {name, youtubeLink};
}