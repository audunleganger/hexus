import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SongPage = () => {
    const { songId } = useParams<{ songId: string }>();
    const [songTitle, setSongTitle] = useState<string>("");
    const [songMp3, setSongMp3] = useState<string>("");
    const [songLyrics, setSongLyrics] = useState<string[][]>([]);

    useEffect(() => {
        const fetchSongObject = async () => {
            try {
                const response = await fetch(`/songs/${songId}.json`);
                const songObject = await response.json();
                setSongTitle(songObject.title);
                setSongLyrics(songObject.lyrics);
                console.log(songLyrics);
            }
            catch (error) {
                console.log("Error fetching song object:", error);
            }
        }
        fetchSongObject();
}, [songId]);


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