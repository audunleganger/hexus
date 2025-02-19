import { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Song {
  id: string;
  title: string;
  author: string;
  melody: string;
  event: string;
  year: number;
  lyrics: string[];
  comments: string[];
  start_page: number;
  end_page: number;
  mp3: string;
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [titleSearch, setTitleSearch] = useState(true);
  const [textSearch, setTextSearch] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState("title asc");

  // Load song objects from each song files. Path: ../public/songs/{songId}.json
  useEffect(() => {
    const fetchSongs = async () => {
      // Try to fetch songs from localstorage first
      try {
        const cachedSongs = localStorage.getItem("songs");
        let songObjects: Song[];
        if (cachedSongs) {
          songObjects = JSON.parse(cachedSongs);
        } else {
          // Fetch song ids from songs-metadata.json
          const response = await fetch("/songs-metadata.json");
          const songIds = await response.json();

          // Load song objects from each line in songIds
          songObjects = await Promise.all(songIds.map(async (songId: string) => {
            const response = await fetch(`/songs/${songId}.json`);
            const songObject = await response.json();
            return songObject;
          }));
        }
          songObjects.sort((a, b) => a.title.localeCompare(b.title, "nb"));
          console.log(songObjects[0].title);
          localStorage.setItem("songs", JSON.stringify(songObjects));
          setSongs(songObjects);
          setLoading(false);
    } catch (error) {
      console.log("Error fetching song objects:", error);
    }
  };
    fetchSongs();
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

  const handleSortTitleToggle = () => {
    const sortedSongs = songs.sort((a, b) => a.title.localeCompare(b.title));
    setSongs(sortedSongs);
  }

  const filteredSongs = songs.filter((song) => {
    const fullLyricsString = textSearch ? song.lyrics.flat(Infinity).join(" ") : "";
    const matchingTitles = song.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingLyrics = fullLyricsString.toLowerCase().includes(searchTerm.toLowerCase());

    return titleSearch && matchingTitles || textSearch && matchingLyrics;
  });

  // const sortedSongs = filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
  // console.log(sortedSongs[0].title);
  // console.log(sortedSongs[1].title);

  return (
    <>
    <h1>Hexus site</h1>
    <label htmlFor="searchField">Søk: </label>
    <input type="text" id="searchField" onChange={handleUpdate} />
    <input type="checkbox" id="titleCheckbox" checked={titleSearch} onChange={handleTitleSearchToggle}/>
    <label htmlFor="titleCheckbox">Tittelsøk</label>
    <input type="checkbox" id="lyricsCheckbox" checked={textSearch} onChange={handleTextSearchToggle}/>
    <label htmlFor="lyricsCheckbox">Tekstsøk</label>
    {loading ? <p>Loading...</p> : 
    <table>
      <thead>
        <tr>
          <th>Tittel</th>
          <th>Forfatter</th>
          <th>Melodi</th>
          <th>Arrangement</th>
          <th>Side</th>
        </tr>
      </thead>
      <tbody>
        {filteredSongs.map((song) => (
          <tr key={song.id}>
            <td><Link to={`/songs/${song.id}`}>{song.title}</Link></td>
            <td>{song.author}</td>
            <td>{song.melody}</td>
            <td>{song.event}</td>
            <td>{song.start_page}</td>
          </tr>
        ))}
      </tbody>
    </table>
    // <ul>
    //   {filteredSongs.map((song) => (
    //     <li key={song.id}>
    //       <Link to={`/songs/${song.id}`}>{song.title}</Link>
    //     </li>
    //   ))}
    // </ul>
    }
    </>
  )
}

export default App
