import './ShareWishlistPage.css';
import {useEffect, useState} from 'react';
import {ProductOptionsProvider} from '@shopify/hydrogen';
import {AddToCartButton} from '@shopify/hydrogen';
import {
  callGenrateRegidAPI,
  fetchListWithContents,
} from '../../../swym/api/store-apis';
import STRINGS from '../../../swym/Utils/strings';
import { getSwymLocalStorage } from '../../../swym/Utils/Utils';
import WishlistItem from '../wishlistItem/wishlistItem.client';

/*
  @author: swym
  @notice: the page opens when a user clicks on the link shared to them(via the copy link mechanism)
  @dev:    renders wishlisted products for that particular wishlist. user can add products to cart
*/

export function ShareWishlistPage() {
  const [list, setItems] = useState();
  const [listName, setListName] = useState(STRINGS.ShareWishlistShareViaLabel);
  const [senderEmail, setSenderEmail] = useState('admin@swymcorp.com');
  const [lid, setLid] = useState('');
  let subHeading = `${STRINGS.SharedWishlistSubHeadingText} ${senderEmail}`;

  useEffect(() => {
    const url = window.location.search;
    const params = new URLSearchParams(url);
    if (lid) {
      getSetListItems({});
    } else {
      setLid(params.get('lid'));
    }
  }, [lid]);

  const getSetListItems = async () => {
    const swymConfig = getSwymLocalStorage();
    if (!swymConfig || !swymConfig.regid) {
      await callGenrateRegidAPI({});
    }
    fetchListWithContents(lid)
      .then((response) => {
        setItems(response?.items);
        setListName(response?.list?.lname);
        setSenderEmail(response?.list?.userinfo.em);
      })
      .catch((e) => console.log(e));
  };
  return (
    <div className="swym-hl-shared-page">
      <div className='swym-hl-shared-page-title'>{listName}</div>
      <p>{subHeading}</p>
      <br />
      <br />
      <div className='swym-hl-shared-page-list-container'>
      {list &&
        list.length > 0 &&
        list.map((item) => (
          <WishlistItem key={item.epi} productId={item.empi} variantId={item.epi} title={item.dt} product={item} />
        ))}
      </div>
    </div>
  );
}
