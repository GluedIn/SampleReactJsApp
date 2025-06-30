import DeleteGrayIcon from "../../assets/icons/DeleteGrayIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import { useNotification } from "../../contexts/Notification";
import Drawer from "../common/Drawer";
import LoaderWithText from "../common/LoaderWithText";
import { debounce } from "lodash";
import gluedin from "gluedin-shorts-js";
import { useEffect, useState } from "react";

const soundModule = new gluedin.GluedInSoundModule();
const hashtagModule = new gluedin.GluedInHashTag();
const discoverModule = new gluedin.GluedInDiscover();

function SidePanel({
  title,
  open,
  onClose,
  fetchOptions,
  handleTag,
  handleRemove,
  multiple = false,
  taggedItems = [],
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showNotification } = useNotification();

  const {
    itemKeys: { id, thumbnail, title: itemTitle, subTitle: itemSubTitle },
  } = fetchOptions ?? {};

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let response;
        if (title === "Sound") {
          response = await soundModule.getSoundList("");
        }
        if (title === "Hashtag") {
          response = await hashtagModule.getHashTagList("");
        }
        if (title === "Friend") {
          response = await discoverModule.getDiscoverTopProfiles("");
        }
        const { data: { result = [] } = {}, status } = response;
        if (status === 200) {
          const items = result.map((item: any) => ({
            ...item,
            id: item[id],
            thumbnail: item[thumbnail],
            title: item[itemTitle],
            subTitle: item[itemSubTitle],
          }));
          setData(items);
          setSearchResults(items);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      const items: any = data.map((item: any) => {
        const tagged =
          taggedItems.findIndex(
            (taggedItem: any) => taggedItem[id] == item[id]
          ) !== -1;
        return {
          ...item,
          id: item[id],
          thumbnail: item[thumbnail],
          title: item[itemTitle],
          subTitle: item[itemSubTitle],
          tagged,
        };
      });
      setSearchResults(items);
    }
  }, [taggedItems, data]);

  // Debounce function to delay the execution of the search function
  const debouncedSearch = debounce(async (term) => {
    setIsLoading(true);
    const filteredList = data.filter((item: any) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
    setData(data);
    setSearchResults(filteredList);
    setIsLoading(false);
  }, 500); // Adjust the delay time as needed

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults(data);
    }
    // Clean up the debounce function on component unmount
    return debouncedSearch.cancel;
  }, [searchTerm]);

  const handleSearchInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleItemTag = (item: any) => {
    handleTag(item);
    if (!multiple) {
      onClose();
    }
    showNotification({
      title: `Tag ${title}`,
      subTitle: `The ${title.toLowerCase()} has been tagged`,
    });
  };

  const handleRemoveTaggedSound = (item: any) => {
    handleRemove(item);
    if (!multiple) {
      onClose();
    }
    showNotification({
      title: `Tag ${title}`,
      subTitle: `The ${title.toLowerCase()} has been deleted`,
    });
  };

  return (
    <Drawer title={`Tag ${title}`} onClose={onClose} open={open}>
      <div className="full-box !mb-0">
        <div className="page-search-box">
          <div className="input-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              name="search"
              placeholder={`Search ${title}...`}
              autoComplete="off"
            />
            <img
              src="./quickplay/images/search-icon.svg"
              className="search-info"
              alt=""
            />
          </div>
        </div>
      </div>

      {isLoading && <LoaderWithText text="Loading..." />}

      {!isLoading && searchTerm && searchResults.length === 0 && (
        <p>No search result found!</p>
      )}

      {!isLoading && searchResults.length > 0 && (
        <ul className="panel-list">
          {searchResults.map((item: any) => (
            <li key={item.id} className="panel-list-item">
              <div className="sound">
                <div className="sound-image">
                  <img src={item.thumbnail} alt="" />
                </div>
                <div className="sound-info">
                  <h4 className="sound-title">{item.title}</h4>
                  <p className="sound-artist">{item.subTitle}</p>
                </div>
              </div>
              <div className="sound-actions">
                {!item.tagged ? (
                  <button
                    className="sound-actions-btn btn_transparent"
                    onClick={() => handleItemTag(item)}
                  >
                    <PlusIcon />
                  </button>
                ) : (
                  <button
                    className="sound-actions-btn btn_transparent"
                    onClick={() => handleRemoveTaggedSound(item)}
                  >
                    <DeleteGrayIcon />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && searchResults.length === 0 && data.length === 0 && (
        <p>No results found!</p>
      )}
    </Drawer>
  );
}

export default SidePanel;
