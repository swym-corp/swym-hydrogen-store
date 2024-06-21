import {useEffect, useState} from 'react';
import {ProductOptionsProvider} from '@shopify/hydrogen';
import './wishlistPage.css';

import {AddToCartButton} from '@shopify/hydrogen';
import {Heading, Text} from '~/components';
import {callDeleteProductFromWishlist} from '../../swym/wishlistPage-apis';
import {WishlistDeleteButton} from './WishlistDeleteButton.client';
import {
  fetchList,
  fetchListWithContents,
  fetchSwymAccessToken,
} from '../../swym/store-apis';
import SwymAlert from '../../swym/Alert';
import {ShareWishlist} from './shareWishlistModal.client';
import WishlistContext from './wishlist-context';
import useWindowDimensions from './Utils/useWindowDimensions';
import './wishlistAddToModal.css';
import {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/*
  @author:  swym
  @notice: Page on which user can see all the wishlisted products
  @dev:    render withslited products. user can add products to cart or remove products from wishlist
  @param:  it will use regid stored in localstorage to fetch user related activities
*/

export function WishlistPage() {
  //const [width, setWidth] = useState(window.innerWidth);
  const {width} = useWindowDimensions();
  const [list, setItems] = useState();
  const [showAlertBox, setshowAlertBox] = useState(false);
  const [alertBoxTitle, setalertBoxTitle] = useState('');
  const [alertBoxInfo, setalertBoxInfo] = useState('');
  const [selectedListIndex, setselectedListIndex] = useState(0);
  const [wishlistCreatedLists, setWishlistCreatedLists] = useState([]);
  const [alertBoxType, setalertBoxType] = useState([]);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [swymAccessToken, setSwymAccessToken] = useState(false);
  const [noOfWishlistedProducts, setNoOfWishlistedProducts] = useState(0);
  const [variantDeleted, setVariantDeleted] = useState(false);

  const breakPoint = 800;

  useEffect(() => {
    getSwymAccessToken();
  }, [swymAccessToken]);

  useEffect(() => {
    fetchList()
      .then((response) => {
        setWishlistCreatedLists(response);
        getNoOfWishlistedProducts(response);
      })
      .catch((e) => console.log(e));
  }, [variantDeleted]);

  useEffect(() => {
    // debugger;
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
          setalertBoxType('success');
          setalertBoxTitle('Success');
          setalertBoxInfo('Product removed from wishlist');
        }
      })
      .catch((e) => {
        console.log(e);
        setshowAlertBox(true);
        setalertBoxType('error');
        setalertBoxTitle('Success');
        setalertBoxInfo('Product removed from wishlist');
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

  const getNoOfWishlistedProducts = (res) => {
    let totalProducts = 0;
    if (res && res.length > 0) {
      res.map((list) => {
        totalProducts = totalProducts + list?.listcontents.length;
      });
      setNoOfWishlistedProducts(totalProducts);
    }
  };

  const handleListValueChange = (e, index) => {
    setselectedListIndex(index);
  };

  const getSelectedClass = (id) =>
    selectedListIndex === id ? 'selected text-white' : '';

  return (
    <div>
      <WishlistContext>
        <SwymAlert
          open={showAlertBox}
          toggleAlertState={setshowAlertBox}
          title={alertBoxTitle}
          info={alertBoxInfo}
          type={alertBoxType}
        />
        {openShareModal && (
          <ShareWishlist
            onPopupToggle={setOpenShareModal}
            lid={wishlistCreatedLists[selectedListIndex]?.lid}
          />
        )}
        <div className="mt-3 mb-20 ">
          <Heading>
            Wishlist{' '}
            {noOfWishlistedProducts > 0 && `(${noOfWishlistedProducts})`}{' '}
          </Heading>
          <br />
          <br />
          {wishlistCreatedLists && wishlistCreatedLists.length == 0 && (
            <div style={{display: 'block', textAlign: 'center'}}>
              <br />
              <br />
              <h3 className="text-xl font-bold">Love It? Add To My Wishlist</h3>
              <p>
                My Wishlist allows you to keep track of all of your favorites
                and shopping activity whether you're on your computer, phone, or
                tablet. You won't have to waste time searching all over again
                for that item you loved on your phone the other day - it's all
                here in one place!
              </p>
            </div>
          )}
          <div className="grid-container">
            {wishlistCreatedLists && wishlistCreatedLists.length > 0 && (
              <div>
                {width > breakPoint ? (
                  <div>
                    <h3 className="text-xl font-bold">Select List</h3>
                    <ul className="swym-wishlist-style-ul">
                      {wishlistCreatedLists &&
                        wishlistCreatedLists.length > 0 &&
                        wishlistCreatedLists.map(({lname}, index) => (
                          <li
                            key={index}
                            value={selectedListIndex}
                            className={`swym-wishlist-style-li ${getSelectedClass(
                              index,
                            )}`}
                            id="navlist"
                            onClick={(e) => handleListValueChange(e, index)}
                          >
                            <Text className="flex-1 min-w-0">{lname}</Text>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                          {wishlistCreatedLists &&
                            wishlistCreatedLists.length > 0 &&
                            wishlistCreatedLists[selectedListIndex].lname}
                          {!wishlistCreatedLists ||
                            (wishlistCreatedLists.length == 0 &&
                              'No list found')}
                          <svg
                            className="-mr-1 ml-2 h-5 w-5"
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
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {wishlistCreatedLists &&
                              wishlistCreatedLists.length > 0 &&
                              wishlistCreatedLists.map(({lname}, index) => (
                                <Menu.Item
                                  value={selectedListIndex}
                                  key={`menu_${index}`}
                                >
                                  {({active}) => (
                                    <a
                                      onClick={(e) =>
                                        handleListValueChange(e, index)
                                      }
                                      key={index}
                                      value={selectedListIndex}
                                      href="#"
                                      className={classNames(
                                        active
                                          ? `bg-gray-100 text-gray-900`
                                          : `text-gray-700`,
                                        `block px-4 py-2 text-sm`,
                                      )}
                                    >
                                      {lname}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <br />
                    <br />
                    <br />
                  </div>
                )}
              </div>
            )}
            <div className="group flex flex-col">
              <div className="flex">
                <h2 className="font-bold text-xl flex-1">
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
                    <h3
                      className=" text-xl float-right"
                      onClick={(event) => onShareWishlistClick(event)}
                    >
                      Share Wishlist
                    </h3>
                  )}
              </div>
              <br />
              <div className="col-span-8 order-3 lg:order-none">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list &&
                    list.length > 0 &&
                    list.map((l) => (
                      <div
                        className="relative shadow-lg flex flex-1 flex-col justify-between"
                        key={l['epi']}
                      >
                        <div className="max-w-sm rounded overflow-hidden flex flex-1 flex-col justify-between">
                          <a
                            key={l['epi']}
                            className="fadeIn h"
                            aria-label={l['dt']}
                            href={l.cprops?.ou}
                          >
                            <img
                              className="w-full"
                              alt={l['dt'] || 'Product Image'}
                              src={l['iu']}
                            />
                            <div className="px-4 pt-2 pb-1">
                              <div className="font-bold text-l">
                                {l['dt']}
                              </div>
                            </div>
                            <div className="px-4">
                              <div className="text-sm">
                                {l['bt']}
                              </div>
                            </div>
                            <div className="px-4 py-2">
                              <div className="text-l">
                                ${l['pr']}
                              </div>
                            </div>
                          </a>
                          <WishlistDeleteButton
                            onClick={() => removeItemFromWishlist(l, true)}
                          />
                          <ProductOptionsProvider
                            data={{
                              id: `gid://shopify/Product/${l.empi}`,
                              title: l.dt,
                              vendor: l.bt,
                              variants: [
                                {
                                  id: `gid://shopify/ProductVariant/${l.epi}`,
                                },
                              ],
                            }}
                          >
                            <a className="p-2" onClick={() => removeItemFromWishlist(l)}>
                              <AddToCartButton
                                className="m-auto w-full swym-bg-2 p-2 rounded text-white"
                                variantId={`gid://shopify/ProductVariant/${l.epi}`}
                                accessibleAddingToCartLabel="Adding item to your cart"
                              >
                                Add to Cart
                              </AddToCartButton>
                            </a>
                          </ProductOptionsProvider>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </WishlistContext>
    </div>
  );
}
