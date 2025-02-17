import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SongPage = () => {
    const { songId } = useParams<{ songId: string }>();
    const [songTitle, setSongTitle] = useState<string>("");
    const [songMp3, setSongMp3] = useState<string>("");
    const [songLyrics, setSongLyrics] = useState<string[][]>([]);

    useEffect(() => {
        const fetchSongMetadata = async () => {
            try {
                const songsMetadata = await import(`../songs_data/songs-metadata.json`);
                const songMetaData = songsMetadata.default.find((song: { id: string }) => song.id === songId);
                if (songMetaData && songMetaData.title) {
                    setSongTitle(songMetaData.title);
                }
                if (songMetaData && songMetaData.mp3) {
                    setSongMp3(songMetaData.mp3);
                }
            } catch (error) {
                console.log("Error fetching song metadata:", error);
            }
        }
        const fetchSongLyrics = async () => {
            try {
                const lyricsObject = await import(`../songs_data/lyrics-files/${songId}.json`);
                setSongLyrics(lyricsObject.lyrics);
            } catch (error) {
                console.log("Error fetching song lyrics:", error);
            }
        }
        fetchSongMetadata();
        fetchSongLyrics();
}, [songId]);

    if (!songTitle) {
        return <p>Song not found</p>;
    }


    return (
        <>
            <h1>{songTitle}</h1> 
            {songMp3 && (
                <audio controls>
                    <source src={songMp3} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
            {songLyrics.map((verse, index) => (
                <p key={index}>
                    {verse.map((line, lineIndex) => (
                        <span key={lineIndex}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            ))}
        </>
    );
}
export default SongPage;