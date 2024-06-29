import './wishlistPage.css';
import {useEffect, useState} from 'react';
import {callDeleteProductFromWishlist} from '../../../swym/api/wishlistPage-apis';
import {
  fetchList,
  fetchListWithContents,
  fetchSwymAccessToken,
} from '../../../swym/api/store-apis';
import SwymAlert from '../common/Alert';
import {ShareWishlist} from '../shareListPopup/shareListPopup.client';
import WishlistContext from '../wishlist-context';
import { setSwymLocalStorageListData } from '../../../swym/Utils/Utils';
import WishlistItem from '../wishlistItem/wishlistItem.client';



export function EmptyWishlist(){
  return (
    <div style={{display: 'block', textAlign: 'center'}}>
      <br />
      <h3 className="swym-hl-empty-wl-title">Love It? Add To My Wishlist</h3>
      <br />
      <p>
        My Wishlist allows you to keep track of all of your favorites and shopping activity whether you're on your computer, phone, or tablet.
      </p>
      <p className='mt-4'>
        You won't have to waste time searching all over again for that item you loved on your phone the other day - it's all here in one place!
      </p>
      <br />
      <button className='swym-hl-continue-shop-btn swym-hl-bg-color swym-hl-text-color' onClick={()=>{
        window.location.href = '/products'
      }}>Continue Shopping</button>
    </div>
  )
}

/*
  @author:  swym
  @notice: Page on which user can see all the wishlisted products
  @dev:    render withslited products. user can add products to cart or remove products from wishlist
  @param:  it will use regid stored in localstorage to fetch user related activities
*/

export function WishlistPage() {
  const [list, setItems] = useState();

  const [showAlertBox, setshowAlertBox] = useState(false);
  const [alertBox, setalertBox ] = useState({ type: 'success', title:'', info: '', image: null });

  const [selectedListIndex, setselectedListIndex] = useState(0);
  const [showLoading, setshowLoading] = useState(true);
  const [wishlistCreatedLists, setWishlistCreatedLists] = useState([]);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [swymAccessToken, setSwymAccessToken] = useState(false);
  const [variantDeleted, setVariantDeleted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    getSwymAccessToken();
  }, [swymAccessToken]);

  useEffect(() => {
    fetchList()
      .then((response) => {
        setWishlistCreatedLists(response);
        setSwymLocalStorageListData(response);
        setshowLoading(false);
      })
      .catch((e) => console.log(e));
  }, [variantDeleted]);

  useEffect(() => {
    if (wishlistCreatedLists && wishlistCreatedLists.length > 0) {
      getSetListItems();
    }
  }, [wishlistCreatedLists, selectedListIndex]);

  const getSetListItems = () => {
    fetchListWithContents(wishlistCreatedLists[selectedListIndex]?.lid)
      .then((response) => {
        setItems(response?.items);
      })
      .catch((e) => console.log(e));
  };

  const removeFromList = (empi, epi) => {
    if (list) {
      let listArray = list.filter(
        (listItem) => empi !== listItem.empi && epi !== listItem.epi,
      );
      setItems(listArray);
    }
  };

  const removeItemFromWishlist = (productData, showDeleteAlert) => {
    callDeleteProductFromWishlist(productData)
      .then((response) => {
        setVariantDeleted((prev) => !prev);
        removeFromList(productData.empi, productData.epi);
        if (showDeleteAlert) {
          setshowAlertBox(true);
          setalertBox({ type:'success', title: 'Success', info: `Product removed from wishlist`, image: productData.iu });
        }
      })
      .catch((e) => {
        console.log(e);
        setshowAlertBox(true);
        setalertBox({ type:'error', title: 'Error', info: `Product not removed from wishlist`, image: productData.iu });
      });
  };

  const onShareWishlistClick = (event) => {
    event.preventDefault();
    setOpenShareModal(true);
  };

  const getSwymAccessToken = () => {
    fetchSwymAccessToken()
      .then((response) => {
        if (response && response !== '') {
          setSwymAccessToken(true);
        } else {
          setSwymAccessToken(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const handleListValueChange = (e, index) => {
    setselectedListIndex(index);
    e.preventDefault();
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <WishlistContext>
        <SwymAlert
          open={showAlertBox}
          toggleAlertState={setshowAlertBox}
          title={alertBox.title}
          info={alertBox.info}
          type={alertBox.type}
          image={alertBox.image}
        />
        {openShareModal && (
          <ShareWishlist
            onPopupToggle={setOpenShareModal}
            lid={wishlistCreatedLists[selectedListIndex]?.lid}
          />
        )}
        <div className="swym-hl-wishlist-page">
          <div className='swym-hl-wishlist-page-title'>
            Wishlist
          </div>
          <br />
          {showLoading && (
            <div className='swym-hl-wishlist-loader-container'>
              <div className='swym-hl-wishlist-loader' style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stopColor="currentColor"></stop><stop offset=".3" stopColor="currentColor" stopOpacity=".9"></stop><stop offset=".6" stopColor="currentColor" stopOpacity=".6"></stop><stop offset=".8" stopColor="currentColor" stopOpacity=".3"></stop><stop offset="1" stopColor="currentColor" stopOpacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" strokeWidth="15" strokeLinecap="round" strokeDasharray="200 1000" strokeDashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="currentColor" strokeWidth="15" strokeLinecap="round" cx="100" cy="100" r="70"></circle></svg>
              </div>
            </div>
          )}
          {!showLoading && (
            <>
              {( !wishlistCreatedLists || wishlistCreatedLists.length == 0 ) && (
                <EmptyWishlist />
              )}
              <div>
                {wishlistCreatedLists && wishlistCreatedLists.length > 1 && (
                  <div>
                      <div>
                        <div className="swym-hl-wl-dropdown-container">
                          <div>
                            <button  onClick={toggleMenu} className="swym-hl-wl-list-dropdown-btn">
                              {wishlistCreatedLists &&
                                wishlistCreatedLists.length > 0 &&
                                wishlistCreatedLists[selectedListIndex].lname}
                              {!wishlistCreatedLists ||
                                (wishlistCreatedLists.length == 0 &&
                                  'No list found')}
                              <svg
                                className="swym-hl-dropdown-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          {isDropdownOpen && (
                            <div className="swym-hl-wl-dropdown-list">
                                {wishlistCreatedLists &&
                                  wishlistCreatedLists.length > 0 &&
                                  wishlistCreatedLists.map(({lname}, index) => (
                                    <a
                                      onClick={(e) =>
                                        handleListValueChange(e, index)
                                      }
                                      key={`menu_${index}`}
                                      value={selectedListIndex}
                                      href="#"
                                      className={`swym-hl-wl-dropdown-list-item ${(selectedListIndex == index)?'swym-hl-dropdown-list-item-active':''}`}
                                    >
                                      {lname}
                                    </a>
                                  ))}
                            </div>
                          )}
                        </div>
                        <br />
                        <br />
                      </div>
                  </div>
                )}
                <div>
                  <div className="swym-hl-wl-content-header">
                    <h2 className="swym-hl-wl-selected-lname">
                      {wishlistCreatedLists &&
                        wishlistCreatedLists.length > 0 &&
                        wishlistCreatedLists[selectedListIndex]?.lname}{' '}
                      {wishlistCreatedLists &&
                        wishlistCreatedLists.length > 0 &&
                        ` (${wishlistCreatedLists[selectedListIndex]?.listcontents?.length})`}
                    </h2>
                    {wishlistCreatedLists &&
                      wishlistCreatedLists.length > 0 &&
                      swymAccessToken && (
                        <div
                          className="swym-hl-wishlist-page-share-btn"
                          onClick={(event) => onShareWishlistClick(event)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            width={15}
                            height={15}
                            fill="#035587"
                            viewBox="0 0 458.624 458.624"
                          >
                            <path d="M339.588 314.529a71.683 71.683 0 0 0-38.621 11.239l-112.682-78.67a72.036 72.036 0 0 0 2.798-19.871c0-6.896-.989-13.557-2.798-19.871l109.64-76.547c11.764 8.356 26.133 13.286 41.662 13.286 39.79 0 72.047-32.257 72.047-72.047S379.378 0 339.588 0c-39.79 0-72.047 32.257-72.047 72.047 0 5.255.578 10.373 1.646 15.308l-112.424 78.491c-10.974-6.759-23.892-10.666-37.727-10.666-39.79 0-72.047 32.257-72.047 72.047s32.256 72.047 72.047 72.047c13.834 0 26.753-3.907 37.727-10.666l113.292 79.097a72.108 72.108 0 0 0-2.514 18.872c0 39.79 32.257 72.047 72.047 72.047s72.047-32.257 72.047-72.047-32.257-72.048-72.047-72.048z" />
                          </svg>
                        </div>
                      )}
                  </div>
                  <br />
                  <div className='swym-hl-wishlist-page-list-container'>
                    {list &&
                      list.length > 0 &&
                      list.map((item) => (
                        <WishlistItem key={item.epi} productId={item.empi} variantId={item.epi} title={item.dt} product={item} readOnly={false} onRemoveItem={()=>removeItemFromWishlist(item, true)} />
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </WishlistContext>
    </div>
  );
}
