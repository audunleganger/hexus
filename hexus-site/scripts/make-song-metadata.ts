import path from "path";
import fs from "fs";

// 1. Declare folder with songs (song1.json, song2.json etc.).
const songsDir = path.join(__dirname, "..", "src", "songs_data", "lyrics-files");

// 2. Declare songMetadata.json output file location
const songsMetadataFile = path.join(__dirname, "..", "src", "songs_data", "songs-metadata.json");
console.log(songsMetadataFile);

// 3. Run throug every file, extract id, title to object
// 4. Append object to songMetadata array
const songMetadata = fs.readdirSync(songsDir).map((fileName) => {
    const song = JSON.parse(fs.readFileSync(path.join(songsDir, fileName), "utf-8"));
    return {
        id: song.id,
        title: song.title,
        mp3: "",
    }
});

// 5. Sort array according to "title attribute"
songMetadata.sort((a, b) => a.title.localeCompare(b.title));
console.log(songMetadata);

// 6. Write songMetadata array to songMetadata.json
fs.writeFileSync(songsMetadataFile, JSON.stringify(songMetadata, null, 2));
console.log("Song metadata generated successfully!");