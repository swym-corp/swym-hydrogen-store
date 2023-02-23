import {getSwymLocalStorage} from './Utils';
import {callGenrateRegidAPI} from './store-apis';
import {v4 as uuidv4} from 'uuid';
import SWYM_CONFIG from './swym.config';

const SWYM_PID = SWYM_CONFIG.PID;
/*
  @notice: get wishlisted product by regid
  @dev:    for single list use this to check if product is wishlisted or not.
  @author: swym
  @return: array of wishlisted products 
*/
export const callFetchWishlistedProductAPI = async () => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => callFetchWishlistedProductAPI(),
    });
  } else {
    // console.log("here in wishlist page")
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return fetch(
      `${
        SWYM_CONFIG.ENDPOINT
      }api/v2/provider/fetchWishlist?pid=${encodeURIComponent(SWYM_PID)}`,
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
  @notice: to remove product from wishlisted items
  @dev:    delete product from swym wishlisted products
  @author: swym
*/
export const callDeleteProductFromWishlist = async (productData) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();

  var urlencoded = new URLSearchParams();
  urlencoded.append('regid', swymConfig.regid);
  urlencoded.append('sessionid', swymConfig.sessionid);
  urlencoded.append('lid', productData.lid);
  urlencoded.append(
    'd',
    `[{ "epi":${productData.epi}, "empi": ${productData.empi}, "du":"${productData.du}"}]`,
  );

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };
  return fetch(
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
  @notice: -
  @dev:    to mark the list id as public for list sharing
  @author: swym
  @params: lid - list id  of the particular wishlist
*/

export const callFetchPublicListAPI = async (lid) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => callFetchPublicListAPI(lid),
    });
  } else {
    // console.log("here in wishlist page")
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);
    urlencoded.append('lid', lid);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return fetch(
      `${SWYM_CONFIG.ENDPOINT}api/v3/lists/markPublic?pid=${encodeURIComponent(
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
  @notice: an email is sent to the given email with the selected list products
  @dev:    share wishlist via email
  @author: swym
  @params: publicLid - the list id which has been marked public previously
  @params: senderName - the name of the sender/username of the person who has logged in  
  @params: emailValue - recipent's email address  
*/

export const callShareEmailAPI = async (publicLid, senderName, emailValue) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () => callShareEmailAPI(publicLid, senderName, emailValue),
    });
  } else {
    // console.log("here in wishlist page")
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);
    urlencoded.append('lid', publicLid);
    urlencoded.append('fromname', senderName);
    urlencoded.append('toemail', emailValue);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return fetch(
      `${SWYM_CONFIG.ENDPOINT}api/v3/lists/emailList?pid=${encodeURIComponent(
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
  @notice: a link is copied to clipboard which can be used to share the wishlist
  @dev:    share wishlist via copy link
  @author: swym
  @params:   publicLid - the list id which has been marked public previously
  @params:   the medium through which we are sharing the list(copyLink, email etc)
  @params:   sharedurl - 
  @params:   shareListSenderName - the name of the sender/username of the person who has logged in
*/

export const callCopyLinkAPI = async (
  publicLid,
  medium,
  sharedurl,
  shareListSenderName,
) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const swymConfig = getSwymLocalStorage();
  if (!swymConfig || !swymConfig.regid) {
    await callGenrateRegidAPI({
      username: null,
      uuid: uuidv4(),
      cb: () =>
        callCopyLinkAPI(publicLid, medium, sharedurl, shareListSenderName),
    });
  } else {
    // console.log("here in wishlist page")
    var urlencoded = new URLSearchParams();
    urlencoded.append('regid', swymConfig.regid);
    urlencoded.append('sessionid', swymConfig.sessionid);
    urlencoded.append('lid', publicLid);
    urlencoded.append('fromname', shareListSenderName);
    urlencoded.append('medium', medium);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };
    return fetch(
      `${SWYM_CONFIG.ENDPOINT}api/v3/lists/reportShare?pid=${encodeURIComponent(
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
