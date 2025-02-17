import { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import songs from "./songs_data/songs-metadata.json";

// Make a data scruture that combines song title and lyrics
// 1. Loop through songs array
// 2. For each song, load file with name equal to song.id
// 3. Read file and parse JSON
// 4. Create new object with song id, title and lyrics
// 5. Append object to new array
interface Song {
  id: string;
  title: string;
  lyrics: string[];
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [titleSearch, setTitleSearch] = useState(true);
  const [textSearch, setTextSearch] = useState(false);
  const [songsWithLyrics, setSongsWithLyrics] = useState<Song[]>([]);

  useEffect(() => {
    const loadSongsWithLyrics = async () => {
      const songsWithLyricsPromises = songs.map(async (song) => {
        const songData = await import(`./songs_data/lyrics-files/${song.id}.json`);
        return {
          id: song.id,
          title: song.title,
          lyrics: songData.lyrics,
        }
      });

      const songsWithLyrics = await Promise.all(songsWithLyricsPromises);
      setSongsWithLyrics(songsWithLyrics);
    };
    loadSongsWithLyrics();
  }, []);

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  };

  const handleTitleSearchToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleSearch(e.target.checked);
  }

  const handleTextSearchToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(e.target.checked);
  }

  const filteredSongs = songsWithLyrics.filter((song) => {
    const fullLyricsString = textSearch ? song.lyrics.flat().join(" ") : "";
    const matchingTitles = song.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingLyrics = fullLyricsString.includes(searchTerm.toLowerCase());

    return titleSearch && matchingTitles || textSearch && matchingLyrics;
  });

  return (
    <>
    <h1>Hexus site</h1>
    <label htmlFor="searchField">Søk: </label>
    <input type="text" id="searchField" onChange={handleUpdate} />
    <input type="checkbox" id="titleCheckbox" checked={titleSearch} onChange={handleTitleSearchToggle}/>
    <label htmlFor="titleCheckbox">Tittelsøk</label>
    <input type="checkbox" id="lyricsCheckbox" checked={textSearch} onChange={handleTextSearchToggle}/>
    <label htmlFor="lyricsCheckbox">Tekstsøk</label>
    <ul>
      {filteredSongs.map((song) => (
        <li key={song.id}>
          <Link to={`/songs/${song.id}`}>{song.title}</Link>
        </li>
      ))}
    </ul>
    </>
  )
}

export default App
