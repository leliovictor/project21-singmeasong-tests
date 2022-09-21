import randomUrlGen from "random-youtube-music-video";
import {faker} from "@faker-js/faker";

async function createRecommendation() {
    const name = faker.music.songName;
    const youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();

    const body = {name, youtubeUrl};

    return body;
}