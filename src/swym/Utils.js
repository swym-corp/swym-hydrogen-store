const LOCAL_STORAGE_TAG_NAME = 'swym-data';
const LOCAL_STORAGE_LIST = 'swym-list-data';

/*
  @author: swym
  @notice: get localstorage data related to swym
  @dev:    get regid and sessionid.
  @return: regid - used for all swym API calls
  @return: sessionid - used for all swym API calls
*/
export const getSwymLocalStorage = () => {
  return JSON.parse(
    window.localStorage.getItem(LOCAL_STORAGE_TAG_NAME) || '{}',
  );
};

/*
  @author: swym
  @notice: update swym localstorage
  @dev:    after user login we will replace old regid with new
  @param:  newRegid - updated regid
*/
export const updateLocalStorageRegid = (newRegid) => {
  const savedConfig = getSwymLocalStorage();
  return window.localStorage.setItem(
    LOCAL_STORAGE_TAG_NAME,
    JSON.stringify({
      ...savedConfig,
      regid: newRegid,
    }),
  );
};

/*
  @author: swym
  @notice: save swym localstorage 
  @dev:    save regid and session id in localstorage
  @param:  value - obj with regid and session id
*/

export const setSwymLocalStorage = (value) => {
  return window.localStorage.setItem(
    LOCAL_STORAGE_TAG_NAME,
    JSON.stringify(value),
  );
};

/*
  @author: swym
  @notice: remove swym localstorage 
  @dev:    on logout remove swym localstorage
*/

export const deleteSwymLocalStorage = () => {
  return window.localStorage.removeItem(LOCAL_STORAGE_TAG_NAME);
};

/*
  @author: swym
  @notice: get localstorage data related to swym
  @dev:    get wishlist list data.
  @return: wishlistedItem - used for getting wishlisted status of button
*/
export const getSwymLocalStorageListData = () => {
  let data = window.localStorage.getItem(LOCAL_STORAGE_LIST) || '{}';
  return JSON.parse(
    data
  );
};

/*
  @author: swym
  @notice: save swym localstorage 
  @dev:    save wishlist list in localstorage
  @param:  value - obj with wishlisted product id variant id
*/

export const setSwymLocalStorageListData = (value) => {
  if(value){
    return window.localStorage.setItem(
      LOCAL_STORAGE_LIST,
      JSON.stringify(value),
    );
  }
};