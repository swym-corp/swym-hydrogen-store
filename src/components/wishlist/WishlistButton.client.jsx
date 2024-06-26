import {useEffect, useState} from 'react';

import {Button} from '~/components';
import SwymAlert from '../../swym/Alert';
import WishlistContext from './wishlist-context';
import CreateWishList from './WishlistPopUp.client';
import { getSwymLocalStorageListData } from '../../swym/Utils';

function WishlistIcon({ style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      width="20px"
      fill="currentColor"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      version="1.1"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      style={style}
    >
      <path fill="none" d="M-64 -256H1216V544H-64z"></path>
      <path
        fillRule="nonzero"
        d="M43.046 9.05c5.137.117 9.856 3.451 11.782 8.485 2.392 6.249.678 13.452-2.495 19.624-3.792 7.375-10.79 12.703-17.966 17.288 0 0-2.796 1.351-5.516-.403-9.246-6.021-17.877-13.963-20.318-24.82C6.676 20.966 9.694 10.628 19.115 9.19c4.72-.721 11.109 2.766 12.808 5.869 1.657-3.095 6.565-5.884 10.694-6.008.215-.002.214-.003.429-.001z"
      ></path>
    </svg>
  );
}

/*
  @author:  swym
  @notice: Swym add to wishlist btn
  @dev:    handle add to wishlist & create new list flow
  @param:  selectedVariant to get variantId
  @param:  productData to get productId
*/

export function WishlistButton({selectedVariant, productData, setWishlistSocialCount, showWishlistIcon}) {
  const [WishlistText, setWishlistText] = useState('Add');
  const [disabled, setDisabled] = useState(false);
  const [addToCartLoading, setaddToCartLoading] = useState(false);
  const [wishlisted, setwishlisted] = useState(false);
  const [showCreateListPopup, setshowCreateListPopup] = useState(false);

  const [alertBoxType, setalertBoxType] = useState();
  const [showAlertBox, setshowAlertBox] = useState(false);
  const [alertBoxTitle, setalertBoxTitle] = useState('');
  const [alertBoxInfo, setalertBoxInfo] = useState('');

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
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

  useEffect(()=>{
    checkButtonWishlistState();
  },[])

  const checkButtonWishlistState = async () => {
    let epi = getProductVariantId();
    let empi = getProductId();

    let listData = getSwymLocalStorageListData();
    
    listData && listData.length && listData?.forEach(list=>{
      list.listcontents.forEach(item=>{
        if(item.empi == empi && item.epi == epi){
          setwishlisted(true);
        }
      })
    })
  }

  let imageUrl = productData?.product?.media?.nodes[0]?.previewImage?.url || selectedVariant?.image?.url;
  return (
    <div>
      <WishlistContext>
        <SwymAlert
          open={showAlertBox}
          type={alertBoxType}
          toggleAlertState={setshowAlertBox}
          title={alertBoxTitle}
          info={alertBoxInfo}
          image={imageUrl}
        />
        { showWishlistIcon && (
          <Button
            disabled={disabled}
            style={{
              backgroundColor: 'transparent',
              color: wishlisted?'red':'pink'
            }}
            loading={addToCartLoading}
            onClick={handleClick}
          >
            <WishlistIcon></WishlistIcon>
          </Button>
        )}
        { !showWishlistIcon && (
            <Button
              disabled={disabled}
              width="full"
              loading={addToCartLoading}
              onClick={handleClick}
              className={wishlisted?"product-wishlisted":""}
              style={{
                backgroundColor: disabled ? '#808080' : '#035587',
                color: disabled ? '#D3D3D3' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WishlistIcon style={{ color: wishlisted?'red':'pink'}}></WishlistIcon>
              <span style={{ marginLeft: '5px' }}>
              {wishlisted?'Added':'Add'} to Wishlist
              </span>
            </Button>
        )}
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
            image={imageUrl}
            setWishlistSocialCount={setWishlistSocialCount}
            onAddedToWishlist={()=>{
              setwishlisted(true);
            }}
          />
        )}
      </WishlistContext>
    </div>
  );
}
