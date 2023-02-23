import SWYM_CONFIG from '../../../swym/swym.config';
export function getFullUserName(firstName, lastName, email) {
  let name = '';
  if (firstName) {
    name += firstName;
  }
  if (lastName) {
    if (firstName) {
      name += ' ';
    }
    name += lastName;
  }
  if (!firstName && !lastName && email) {
    return email;
  }
  return name;
}

export function getSharedURL(hostname, lid) {
  return `${hostname}/${SWYM_CONFIG.swymSharedURL}?hkey=${lid}&lid=${lid}`;
}

export function validateStringOptional(str, optionsObj) {
  if (str && str.length < optionsObj.minLength) {
    return optionsObj.minLengthError;
  }
  if (str && str.length > optionsObj.maxLength) {
    return optionsObj.maxLengthError;
  }
}

export function validateEmail(email, errorMsg) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    return errorMsg;
  }
}

/*
  @author: swym
  @notice: badge for wishlist list name
  @dev:    badge icon for wishlist icon created by wishlist name
  @param:  wishlistName - name of wishlist
  @param:  defaultText - default wishlist name
*/

export function getWishlistBadgeLetters(wishlistName, defaultText) {
  if (!wishlistName) {
    return defaultText;
  }
  const badgeTextArr = wishlistName.trim().split(' ');
  let letters = defaultText;
  if (badgeTextArr.length >= 1) {
    letters = badgeTextArr[1]
      ? badgeTextArr[0][0] + badgeTextArr[1][0]
      : badgeTextArr[0][0];
  }
  return letters;
}
