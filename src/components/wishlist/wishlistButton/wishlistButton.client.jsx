import { useEffect, useState } from 'react';
import './wishlistButton.css';
import { getSwymLocalStorageListData, setSwymLocalStorageListData, getSwymLocalStorageListId, setSwymLocalStorageListId } from '../../../swym/Utils/Utils';
import { AddToWishlist, removeFromWishlist, createList, fetchList } from '../../../swym/api/store-apis';
import AddToListPopup from '../addToListPopup/addToListPopup.client';
import SwymAlert from '../common/Alert';
import WishlistContext from '../wishlist-context';

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

export function WishlistButton({ variantId, productId, productUrl, productImageUrl, product, buttonType, addToMultiList }) {
    
    let [wishlisted, setwishlisted] = useState(false);

    const [showAddtoListPopup, setshowAddtoListPopup] = useState(false);
    const [selectedListId, setSelectedListId] = useState(null);

    const [showAlertBox, setshowAlertBox] = useState(false);
    const [alertBox, setalertBox ] = useState({ type: 'success', title:'', info: '', image: productImageUrl });
    

    useEffect(()=>{
        checkButtonWishlistState();
        if(!addToMultiList){
            getListId();
        }
    },[])

    useEffect(()=>{
        document.body.style.overflowY =  showAddtoListPopup? 'hidden':'auto';
    },[showAddtoListPopup]);

    const checkButtonWishlistState = async () => {

        let wishlisted = false;
        let listData = getSwymLocalStorageListData();
        
        listData && listData.length && listData?.forEach(list=>{
            list.listcontents.forEach(item=>{
                if(item.empi == productId && item.epi == variantId){
                    wishlisted = true;
                }
            })
        });
        setwishlisted(wishlisted);
    }

    const getListId = async () => {
        let listId = getSwymLocalStorageListId();
    
        if (listId) {
            setSelectedListId(listId);
            return;
        }
    
        let listData = getSwymLocalStorageListData();
    
        if (!listData || !listData.length) {
            listData = await fetchList();
    
            if (listData && listData.length) {
                setSwymLocalStorageListData(listData);
            } else {
                listData = [await createList()];
            }
        }
    
        let lid = listData[0]?.lid;
        setSelectedListId(lid);
        setSwymLocalStorageListId(lid);
    };

    const updateButtonState = async () => {
        let listData = await fetchList();
        setSwymLocalStorageListData(listData);
        checkButtonWishlistState();
    }
    
    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(addToMultiList){
            setshowAddtoListPopup(!showAddtoListPopup);
        }else{
            if(wishlisted){
                let resData = await removeFromWishlist(productId, variantId, productUrl, selectedListId);
                if(resData){
                    setalertBox({ type:'success', title: 'success', info: `Product ${product?.title} removed from wishlist`, image: productImageUrl });
                    setshowAlertBox(true);
                    updateButtonState();
                }
            }else{
                let resData = await AddToWishlist(productId, variantId, productUrl, selectedListId);
                if(resData){
                    setalertBox({ type:'success', title: 'success', info: `Product ${product?.title} added to wishlist`, image: productImageUrl });
                    setshowAlertBox(true);
                    updateButtonState();
                }
            }
        }
    };

    return (
        <WishlistContext>
            <SwymAlert
                open={showAlertBox}
                type={alertBox?.type}
                toggleAlertState={setshowAlertBox}
                title={alertBox?.title}
                info={alertBox?.info}
                image={alertBox?.image}
            />
            { showAddtoListPopup &&  <AddToListPopup title={product?.title} productId={productId} variantId={variantId} productUrl={productUrl} image={productImageUrl} onPopupToggle={setshowAddtoListPopup}  setalertBox={setalertBox} setshowAlertBox={setshowAlertBox} 
                onAddedToWishlist={()=>{
                    setwishlisted(true);
                }} 
            /> }
            <div onClick={handleClick} className={ ` ${buttonType == 'icon'?'swym-hl-wl-icon':''}  swym-hl-wl-btn swym-hl-bg-color ${wishlisted?'swym-hl-product-wishlisted':'swym-hl-text-color'} swym-hl-btn-center-align`}>
                { ( buttonType == 'icon' || buttonType == 'icontext' ) && <WishlistIcon style={{ marginRight: '5px'}} /> }
                { ( buttonType != 'icon' ) && <span className='swym-hl-text-color'>{wishlisted?'Added':'Add'} to Wishlist</span> }
            </div>
        </WishlistContext>
    );
}