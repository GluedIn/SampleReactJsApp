import DeleteIcon from "../../../assets/icons/DeleteIcon";
import MusicAddIcon from "../../../assets/icons/MusicAddIcon";
import MusicPauseIcon from "../../../assets/icons/MusicPauseIcon";
import MusicPlayIcon from "../../../assets/icons/MusicPlayIcon";
import SearchIcon from "../../../assets/icons/SearchIcon";
import LoaderDark from "../../common/LoaderDark/LoaderDark";
import "./CreatorMusic.css";
import gluedin from "gluedin-shorts-js";
import { debounce } from "lodash";
import React, { useEffect, useState, useRef, useMemo } from "react";
import useIsMobile from "../../../hooks/useIsMobile";

const soundModule = new gluedin.GluedInSoundModule();

function CreatorMusic({
  onMusicSelect,
  setMusicToolSelected,
  audioFile,
}: {
  onMusicSelect?: (track: any) => void;
  setMusicToolSelected?: any;
  audioFile?:any;
}) {
  const [musicList, setMusicList] = useState<any[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  //   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults]: any = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await soundModule.getSoundList("");
        const { data: { result = [] } = {} } = response;
        setMusicList(result);
      } catch (error) {
        console.error("Error fetching music list:", error);
      }
      setIsLoading(false);
    }
    fetchData();

    return () => {
      // Stop the audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingTrack(null);
    };
  }, []);

  // Debounce function for search filtering
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setIsLoading(true);
        const filteredList = musicList.filter((item: any) =>
          item?.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredList);
        setIsLoading(false);
      }, 500),
    [musicList]
  ); // Memoize the debounce function with 'data' dependency

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults(musicList);
    }
    return () => debouncedSearch.cancel(); // Cleanup on unmount
  }, [searchTerm, musicList, debouncedSearch]);

  const handlePlayPause = (trackUrl: string, trackId: string) => {
    if (playingTrack === trackId) {
      //   audio?.pause();
      audioRef.current?.pause();
      setPlayingTrack(null);
    } else {
      //   audio?.pause();
      audioRef.current?.pause(); // Pause the previous audio if it exists
      const newAudio = new Audio(trackUrl);
      newAudio.play();
      audioRef.current = newAudio;
      //   setAudio(newAudio);
      setPlayingTrack(trackId);

      newAudio.onended = () => setPlayingTrack(null);
    }
  };

  const handleAddMusic = (track: any) => {
    // Stop any currently playing music
    // audio?.pause();
    // setPlayingTrack(null);

    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingTrack(null);

    setSelectedMusic(track);
    onMusicSelect?.(track); // Call the function only if it exists
    setMusicToolSelected(true);
  };

  const handleRemoveMusic = (trackId: string) => {
    if (audioFile?.soundId === trackId) {
      setSelectedMusic(null);
      onMusicSelect?.(null);
      setMusicToolSelected(false);
    }
  };

  const handleSearchInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="full-box">
        <div className="page-search-box">
          <div className="input-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              name="search"
              placeholder="Search Music..."
              autoComplete="off"
            />
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className="music-container mt-4">
        <ul>
          {isLoading && searchResults?.length === 0 && <LoaderDark />}

          {!isLoading &&
            searchResults?.map((track: any) => (
              <li key={track.soundId} className="music-item">
                <div className="music-item-content">
                  <img
                    src={track.thumbnail}
                    alt={track.name}
                    width={70}
                    height={70}
                  />
                  <div className="music-item-name">
                    <h2>{track.name}</h2>
                    <span>{track.artist}</span>
                  </div>
                </div>

                <div className="music-item-actions">
                  {audioFile?.soundId === track?.soundId ? (
                    <button onClick={() => handleRemoveMusic(track.soundId)}>
                      {isMobile ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g
                            id="Delete_Icon"
                            data-name="Delete Icon"
                            transform="translate(-301 -232)"
                          >
                            <g
                              id="Group_25514"
                              data-name="Group 25514"
                              transform="translate(-22.568 -474.568)"
                            >
                              <circle
                                id="Ellipse_2005"
                                data-name="Ellipse 2005"
                                cx="12"
                                cy="12"
                                r="12"
                                transform="translate(323.568 706.568)"
                                fill="#fff"
                              />
                            </g>
                            <path
                              id="Path_21852"
                              data-name="Path 21852"
                              d="M5,3.2V2h6V3.2h3V4.4H12.8v9a.6.6,0,0,1-.6.6H3.8a.6.6,0,0,1-.6-.6v-9H2V3.2ZM4.4,4.4v8.4h7.2V4.4ZM6.2,6.2H7.4V11H6.2Zm2.4,0H9.8V11H8.6Z"
                              transform="translate(305 236)"
                              fill="#252525"
                            />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="28"
                          viewBox="0 0 27 28"
                        >
                          <g
                            id="Group_31049"
                            data-name="Group 31049"
                            transform="translate(0.341 0.297)"
                          >
                            <g
                              id="Group_25514"
                              data-name="Group 25514"
                              transform="translate(0 0)"
                            >
                              <ellipse
                                id="Ellipse_2005"
                                data-name="Ellipse 2005"
                                cx="13.5"
                                cy="14"
                                rx="13.5"
                                ry="14"
                                transform="translate(-0.341 -0.297)"
                                fill="#181818"
                              />
                              <path
                                id="Path_24859"
                                data-name="Path 24859"
                                d="M5.642,3.457V2h7.284V3.457h3.642V4.914H15.112V15.84a.728.728,0,0,1-.728.728H4.185a.728.728,0,0,1-.728-.728V4.914H2V3.457ZM4.914,4.914v10.2h8.741V4.914ZM7.1,7.1H8.556v5.827H7.1Zm2.914,0h1.457v5.827H10.013Z"
                                transform="translate(3.875 4.703)"
                                fill="#fff"
                              />
                            </g>
                          </g>
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button onClick={() => handleAddMusic(track)}>
                      <MusicAddIcon />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handlePlayPause(track.soundUrl, track.soundId)
                    }
                  >
                    {playingTrack === track.soundId ? (
                      <MusicPauseIcon />
                    ) : (
                      <MusicPlayIcon />
                    )}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default CreatorMusic;
