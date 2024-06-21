import {useState} from 'react';

import {Button} from '~/components';
import SwymAlert from '../../swym/Alert';
import WishlistContext from './wishlist-context';
import CreateWishList from './WishlistPopUp.client';

/*
  @author:  swym
  @notice: Swym add to wishlist btn
  @dev:    handle add to wishlist & create new list flow
  @param:  selectedVariant to get variantId
  @param:  productData to get productId
*/

export function WishlistButton({selectedVariant, productData, setWishlistSocialCount}) {
  const [WishlistText, setWishlistText] = useState('Add');
  const [disabled, setDisabled] = useState(false);
  const [addToCartLoading, setaddToCartLoading] = useState(false);
  const [showCreateListPopup, setshowCreateListPopup] = useState(false);

  const [alertBoxType, setalertBoxType] = useState();
  const [showAlertBox, setshowAlertBox] = useState(false);
  const [alertBoxTitle, setalertBoxTitle] = useState('');
  const [alertBoxInfo, setalertBoxInfo] = useState('');

  const handleClick = (event) => {
    event.preventDefault();
    setshowCreateListPopup(true);
  };

  const getProductId = () => {
    if (productData?.product?.id) {
      return productData?.product?.id.split('Product/')[1];
    }
  };

  const getProductVariantId = () => {
    if (selectedVariant?.id) {
      return selectedVariant?.id.split('ProductVariant/')[1];
    }
  };

  return (
    <div>
      <WishlistContext>
        <SwymAlert
          open={showAlertBox}
          type={alertBoxType}
          toggleAlertState={setshowAlertBox}
          title={alertBoxTitle}
          info={alertBoxInfo}
        />
        <Button
          disabled={disabled}
          width="full"
          loading={addToCartLoading}
          onClick={handleClick}
          style={{
            backgroundColor: disabled ? '#808080' : '#035587',
            color: disabled ? '#D3D3D3' : 'white',
          }}
        >
          {WishlistText} to Wishlist
        </Button>
        {showCreateListPopup && (
          <CreateWishList
            setshowAlertBox={setshowAlertBox}
            setalertBoxType={setalertBoxType}
            setalertBoxInfo={setalertBoxInfo}
            setalertBoxTitle={setalertBoxTitle}
            onPopupToggle={setshowCreateListPopup}
            title={productData?.product?.title}
            productId={getProductId()}
            productVariantId={getProductVariantId()}
            image={productData?.product?.media.nodes[0]?.previewImage?.url}
            setWishlistSocialCount={setWishlistSocialCount}
          />
        )}
      </WishlistContext>
    </div>
  );
}
