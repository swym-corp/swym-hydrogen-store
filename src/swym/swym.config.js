/*
  @author: swym
  @notice: Important config for swym workflow.
  @dev:    tokens to be added for target store
  @return:  REST_API_KEY - key from swym ( get it from swym-admin )
  @return:  ENDPOINT - swym base URL
  @return:  PID - swym pid for your store
  @return:  defaultWishlistName - default list name ( useful for single list )
  @return:  swymSharedURL - this 'swym' can be updated to any folder name for custom implementation
  @return:  alertTimeOut - alert popup timout in ms 
*/

const SWYM_CONFIG = {
  REST_API_KEY:
    'ZqthS4PnfTMF44_S0CvUgxWTEQ-oW5-fJtFKOjOlhED6QCDImHoXrDfWAlaFYHxc5-NeTm5uZ64mGDGNHQ7-4Q',
  ENDPOINT: 'https://swymstore-v3dev-01-01.swymrelay.com/',
  PID: '5UO2uvfobcvvmOhbLZl96G6LMikgiNtLIow/NNEOeGc=',
  defaultWishlistName: 'My Wishlist',
  alertTimeOut: 5000,
  swymSharedURL: 'swym/shared-wishlist',
  swymSharedMediumCopyLink: 'copylink',
};

export default SWYM_CONFIG;
