import {useEffect, useState} from 'react';
import {ProductOptionsProvider} from '@shopify/hydrogen';
import './wishlistPage.css';
import {AddToCartButton} from '@shopify/hydrogen';
import {Heading, Text} from '~/components';
import {
  callGenrateRegidAPI,
  fetchListWithContents
} from '../../swym/store-apis';
import STRINGS from './Utils/strings';

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
    await callGenrateRegidAPI({});
    fetchListWithContents(lid)
      .then((response) => {
        setItems(response?.items);
        setListName(response?.list?.lname);
        setSenderEmail(response?.list?.userinfo.em);
      })
      .catch((e) => console.log(e));
  };
  return (
    <div className="mt-3 mb-20 ">
      <Heading>{listName}</Heading>
      <Text>{subHeading}</Text>
      <br />
      <br />
      <div className="grid-container">
        <div className="col-span-8 order-3 lg:order-none">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list &&
              list.length > 0 &&
              list.map((l) => (
                <div
                  className="relative p-2 shadow-lg flex flex-1 flex-col justify-between"
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
                      <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{l['dt']}</div>
                      </div>
                    </a>
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
                      <a onClick={() => removeItemFromWishlist(l)}>
                        <AddToCartButton
                          className="m-auto w-full bg-black p-4 rounded text-white"
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
  );
}
