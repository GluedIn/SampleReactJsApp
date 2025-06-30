/* eslint-disable */
import DeleteGrayIcon from "../../../assets/icons/DeleteGrayIcon";
import PlusIcon from "../../../assets/icons/PlusIcon";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { useNotification } from "../../../contexts/Notification";
import gluedin from "gluedin-shorts-js";
import { debounce } from "lodash";
import React, { useEffect, useState, useMemo } from "react";

const DiscoverModule = new gluedin.GluedInDiscover();

function CreatorFriend({
  fetchOptions,
  handleTag,
  handleRemove,
  taggedItems = [],
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults]: any = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    itemKeys: { id, thumbnail, fullName: itemTitle, userName: itemSubTitle },
  } = fetchOptions ?? {};

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let response = await DiscoverModule.getDiscoverTopProfiles("");
        const { data: { result = [] } = {}, status } = response;
        if (status === 200) {
          const items = result.map((item: any) => ({
            id: item[id],
            thumbnail: item[thumbnail],
            fullName: item[itemTitle],
            userName: item[itemSubTitle],
          }));
          setData(items);
          setSearchResults(items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      const items: any = data.map((item: any) => ({
        ...item,
        tagged: taggedItems.some(
          (taggedItem: any) => taggedItem.id === item.id
        ),
      }));
      setSearchResults(items);
    }
  }, [taggedItems, data]);

  // Debounce function for search filtering
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setIsLoading(true);
        const filteredList = data.filter((item: any) =>
          item.fullName.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredList);
        setIsLoading(false);
      }, 500),
    [data]
  ); // Memoize the debounce function with 'data' dependency

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults(data);
    }
    return () => debouncedSearch.cancel(); // Cleanup on unmount
  }, [searchTerm, data, debouncedSearch]);

  const handleSearchInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="full-box !mb-0">
        <div className="page-search-box">
          <div className="input-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              name="search"
              placeholder="Search here..."
              autoComplete="off"
            />
            <SearchIcon/>
          </div>
        </div>
      </div>
      {!isLoading && searchResults?.length > 0 && (
        <ul className="panel-list">
          {searchResults?.map((item: any) => (
            <li key={item.id} className="panel-list-item">
              <div className="sound">
                <div className="sound-image">
                  <img src={item?.thumbnail} alt="" />
                </div>
                <div className="sound-info">
                  <h4 className="sound-title">{item?.fullName}</h4>
                  <p className="sound-artist">{item?.userName}</p>
                </div>
              </div>
              <div className="sound-actions">
                {!taggedItems.some(
                  (taggedUser: any) => taggedUser.id === item.id
                ) && (
                  <button
                    className="sound-actions-btn btn_transparent btn_add"
                    onClick={() => handleTag(item)}
                  >
                    Add
                  </button>
                )}

                {taggedItems.some(
                  (taggedUser: any) => taggedUser.id === item.id
                ) && (
                  <button
                    className="sound-actions-btn btn_transparent btn_remove"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default CreatorFriend;
