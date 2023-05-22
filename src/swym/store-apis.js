import {
  setSwymLocalStorage,
  getSwymLocalStorage,
  updateLocalStorageRegid,
} from './Utils';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import SWYM_CONFIG from './swym.config';
const SWYM_PID = SWYM_CONFIG.PID;
/*
  @author: swym
  @notice: to get unique token as user identifier for swym
  @dev:    token call regid will be used for all swym api. genrated data will be stored in localstorage
  @param:  appId = Wishlist 
  @param:  useragenttype = mobile/desktop
*/
export const callGenrateRegidAPI = async ({
  appId = 'Wishlist',
  useragenttype = 'mobile',
  cb = () => {},
}) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  const urlencoded = new URLSearchParams();

  urlencoded.append('appId', appId);
  urlencoded.append('useragenttype', useragenttype);
  return await axios
    .post('/api/genrateRegid/', {
      appId,
      useragenttype,
    })
    .then((responseJSON) => {
      setSwymLocalStorage({
        regid: responseJSON?.data?.regid,
        sessionid: responseJSON?.data?.sessionid,
      });

      return responseJSON;
    })
    .then((res) => {
      if (!res.error) {
        cb();
      }
    })
    .catch((e) => {
      console.log('Exception', e);
      return {
        error: e.toString(),
      };
    });
};

/*
  @author: swym
  @notice: to generate new  regid and sync old regid user actions after login
  @dev:    update regid after user login and sync all previous wishlist actions to it
  @param:  regid = regid created before user login
*/

export const callValidateSyncRegidAPI = ({
  regid,
  appId = 'Wishlist',
  useragenttype = 'mobile',
  cb = () => {},
}) => {
  try {
    axios
      .post(`/api/validateSyncRegid/`, {
        appId,
        regid,
      })
      .then((responseJSON) => {
        updateLocalStorageRegid(responseJSON?.data?.regid);

        cb();
      });
  } catch (error) {
    return {
      error: error.toString(),
    };
  }
};
export const AddToWishlist = async (
  productId,
  variantId,
  productUrl,
  customLid,
) => {
  let lid = '';
  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => AddToWishlist(productId, variantId, productUrl),
    });
  } else if (customLid) {
    return updateList(productId, variantId, productUrl, customLid)
      .then((response) => {
        // console.log("update list" , response)
        return response;
      })
      .catch((e) => console.log(e));
  } else {
    const res = fetchList().then((response) => {
      if (response) {
        if (response.length === 0) {
          const resp = createList()
            .then((response) => {
              if (response) {
                lid = response.lid;
                const resValue = updateList(
                  productId,
                  variantId,
                  productUrl,
                  lid,
                )
                  .then((response) => {
                    // console.log("update list" , response)
                    return response;
                  })
                  .catch((e) => console.log(e));
                // console.log("send repomse bavk" , resValue)
                return resValue;
              }
            })
            .catch((e) => console.log(e));
          return resp;
        } else {
          lid = lid === '' ? response[0].lid : lid;
          updateList(productId, variantId, productUrl, lid).then((response) => {
            return response;
          });
        }
        return response;
      }
    });
    return res;
  }
};

/*
  @author: swym
  @notice: fetch wishlist names created by clients
  @dev:    lists created by user - call only when user multilist is enable
  @return: array of created lists
*/

export const fetchList = async () => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => fetchList(),
    });
  } else {
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return await fetch(
      `${SWYM_CONFIG.ENDPOINT}api/v3/lists/fetch-lists?pid=${encodeURIComponent(
        SWYM_PID,
      )}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log('error', error);

        return error;
      });
  }
};

/*
  @author: swym
  @notice: fetch content of given list 
  @dev:    use listid to fetch list content
  @params: lid - id of list
  @return: array of list items
*/
export const fetchListWithContents = async (lid) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => fetchListWithContents(lid),
    });
  } else {
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);
    // urlencoded.append('pid', SWYM_PID);
    urlencoded.append('lid', lid);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return await fetch(
      `${
        SWYM_CONFIG.ENDPOINT
      }api/v3/lists/fetch-list-with-contents?pid=${encodeURIComponent(
        SWYM_PID,
      )}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log('error', error);

        return error;
      });
  }
};

/*
  @author:  swym
  @notice:  add product to wishlist
  @dev:     use prodcutId and variantId to wishlist product 
  @params:  productId - product numbered id 
  @params:  variantId - product variant numbered id 
  @params:  productUrl - pdp page url 
  @params:  lid - list id to add product to 
*/
export const updateList = async (productId, variantId, productUrl, lid) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();

  var urlencoded = new URLSearchParams();
  urlencoded.append('regid', swymConfig.regid);
  urlencoded.append('sessionid', swymConfig.sessionid);
  urlencoded.append('lid', lid);
  urlencoded.append(
    'a',
    `[{ "epi":${variantId}, "empi": ${productId}, "du":"${productUrl}", "cprops": {"ou":"${productUrl}"}, "note": null, "qty": 1 }]`,
  );

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  return await fetch(
    `${SWYM_CONFIG.ENDPOINT}api/v3/lists/update-ctx?pid=${encodeURIComponent(
      SWYM_PID,
    )}`,
    requestOptions,
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log('error', error);

      return error;
    });
};

/*
  @author: swym
  @notice: create new list by name
  @dev:    for multiple list. this create new list for given listname
  @params: listName - name of new list (>3 char && unique)
*/
export const createList = async (listName) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => createList(listName),
    });
  } else {
    var urlencoded = new URLSearchParams();
    urlencoded.append('lname', listName || 'My Wishlist');
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return await fetch(
      `${SWYM_CONFIG.ENDPOINT}api/v3/lists/create?pid=${encodeURIComponent(
        SWYM_PID,
      )}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log('error', error);

        return error;
      });
  }
};

/*
  @author: swym
  @notice: - 
  @dev:    fetches the access token from headers when a user logs in
*/

export const fetchSwymAccessToken = async () => {
  const res = await axios
    .post('/api/getCustomerAccessToken')
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.log('Exception', e);
      return e;
    });
  return res;
};

/**
 * @author swym
 * @dev fetches the wishlist social count of a product
 * @param {Number} empi - product id of the product
 * @param {String} du - product URL
 * @returns {Object} data - { count, topic, empi }
 */
export const getWishlistSocialCount = async ({empi, du}) => {
  let swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({});
  }
  swymConfig = getSwymLocalStorage();
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  var queryParams = new URLSearchParams();
  queryParams.append('pid', SWYM_PID);
  queryParams.append('regid', swymConfig.regid);
  queryParams.append('sessionid', swymConfig.sessionid);
  if (empi) 
    queryParams.append('empi', empi);
  if (du) 
    queryParams.append('du', du);

  return await fetch(
    `${SWYM_CONFIG.ENDPOINT}api/v3/product/wishlist/social-count?${queryParams}`,
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return error;
    });
};
