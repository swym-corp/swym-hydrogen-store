import { useContext, useEffect, useState } from 'react';
import './addToListPopup.css';
import WishlistNameItem from './WishlistNameItem.client';
import { DataContext } from '../wishlist-context';
import { AddToWishlist, createList, fetchList } from '../../../swym/api/store-apis';
import { setSwymLocalStorageListData } from '../../../swym/Utils/Utils';
import SWYM_CONFIG from '../../../swym/swym.config';

export function validateString(name, errorsObj) {
    if (!name) {
      return errorsObj.empty;
    }
    if (name.length < 3) {
      return errorsObj.minLength;
    }
    if (name.length > 50) {
      return errorsObj.maxLength;
    }
}

export const validateUniqueString = (newList, previousListArr, errorStr) => {
    if (previousListArr.indexOf(newList) !== -1) {
        return errorStr;
    }
};

function Loader({showLoading, width = 30 }){
    return (
        <>
        {showLoading && 
            <div className='swym-hl-modal-loader'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={width}><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stopColor="currentColor"></stop><stop offset=".3" stopColor="currentColor" stopOpacity=".9"></stop><stop offset=".6" stopColor="currentColor" stopOpacity=".6"></stop><stop offset=".8" stopColor="currentColor" stopOpacity=".3"></stop><stop offset="1" stopColor="currentColor" stopOpacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" strokeWidth="15" strokeLinecap="round" strokeDasharray="200 1000" strokeDashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="currentColor" strokeWidth="15" strokeLinecap="round" cx="100" cy="100" r="70"></circle></svg> 
            </div>
        }
        </>
    )
}

export default function AddToListPopup({title, productId, variantId, productUrl, image, onPopupToggle, setshowAlertBox, setalertBox, onAddedToWishlist}){

    const [showCreateNewList, setshowCreateNewList] = useState(false);
    const [showLoading, setshowLoading] = useState(false);
    const [showListLoading, setshowListLoading] = useState(false);
    const [customListName, setcustomListName] = useState('');
    const [wishlistName, setWishlistName] = useState('');
    const [error, setError] = useState();

    const {
        selectedCustomNameIndex,
        setselectedCustomNameIndex,
        savedList,
        setsavedList,
        WishlistText,
        setWishlistText,
    } = useContext(DataContext);

    useEffect(() => {
        getSetList();
    }, []);
    
    const getSetList = async () => {
        try {
            setshowListLoading(true);
            const res = await fetchList();
            setSwymLocalStorageListData(res);
            setshowListLoading(false);
            if (res && res.length > 0) {
                setsavedList(res);
                setselectedCustomNameIndex(0);
            }else{
                setshowCreateNewList(true);
            }
            console.log('this is', res);
        } catch (e) {
          console.log('Exception', e);
        }
    };

    const createNewList = () => {
        setshowCreateNewList(true);
    }

    const hideCreateNewList = () => {
        setshowCreateNewList(false);
    }

    const createListByName = async () => {
        if (!error) {
          try {
            setshowLoading(true);
            const res = await createList(wishlistName);
            setshowLoading(false);
            if (res.di) {
              setsavedList([...savedList, res]);
              setshowAlertBox(true);
              setalertBox({ type:'success', title: 'success', info: 'List Created', image });
              setWishlistName('');
              hideCreateNewList();
              return res;
            } else {
              setshowAlertBox(true);
              setalertBox({ type:'error', title: 'Error', info: 'List not created', image });
            }
          } catch (e) {
            console.log('Exception', e);
            setshowAlertBox(true);
            setalertBox({ type:'error', title: 'Error', info: 'List not created', image });
          }
        } else {
          setshowAlertBox(true);
          setalertBox({ type:'error', title: 'Failed', info: 'List not created', image });
          setWishlistName('');
        }
    };

    function validateWishlistName(name) {
        let wishlists = [];
        {
          savedList &&
            savedList.length > 0 &&
            savedList.map((list) => {
              wishlists.push(list);
            });
        }
        let validateStringVar = validateString(name, {
          empty: 'Must provide a list name',
          minLength: 'Name must be longer than 3 characters',
          maxLength: 'Name must be less than 50 characters long',
        });
        let validateUniqueStringVar = validateUniqueString(
          name,
          wishlists.map((list) => {
            return list.lname;
          }),
          'List name already exists',
        );
        return validateStringVar || validateUniqueStringVar;
    }
    
    function validateAndSetListName(value) {
        setWishlistName(value);
        setError(validateWishlistName(value));
        console.log(error);
    }
    
    const addProductToWishlist = async () => {
        try {
          let selectedListName = savedList[selectedCustomNameIndex]?.lid;
          if (wishlistName && wishlistName.length > 0) {
            let newList = await createListByName();
            selectedListName = newList.lid;
          }
          setshowLoading(true);
          let res = await AddToWishlist(
            productId,
            variantId,
            productUrl,
            selectedListName,
          );
          setshowLoading(false);
          if (res?.a) {
            setshowAlertBox(true);
            setalertBox({ type:'success', title: 'success', info:'Product addded to wishlist', image });
            onPopupToggle(false);
            getSetList();
            onAddedToWishlist && onAddedToWishlist();
          } else {
            setshowAlertBox(true);
            setalertBox({ type:'error', title: 'Error', info: 'Product not added to wishlist', image });
          }
        } catch (e) {
          console.log('Exception', e);
          setshowLoading(false);
          setshowAlertBox(true);
          setalertBox({ type:'error', title: 'Error', info: 'Product not added to wishlist', image });
        }
    };
    
    return (
        <div id="swym-hl-add-to-list-popup" className="modal" onClick={(e)=> { e.preventDefault(); e.stopPropagation(); onPopupToggle(false) }}>
            <div className="swym-hl-modal-content" onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
                <span className="swym-hl-modal-close-btn" onClick={()=>onPopupToggle(false)}>&times;</span>
                <div className="swym-hl-product-title">
                    <div className="swym-hl-product-image">
                        <img src={image} alt="" />
                    </div>
                    <h3 className="swym-product-name swym-heading swym-heading-1 swym-title-new">{title}</h3>
                </div>
                <div className="swym-hl-product-content">
                    {showCreateNewList && (
                        <div>
                            <div className="swym-hl-new-wishlist-item swym-hl-new-wishlist-input-container">
                                <input
                                    type="text"
                                    className={`swym-new-wishlist-name swym-no-zoom-fix swym-input ${error?'swym-input-has-error':''}`}
                                    onChange={(e) => {
                                        validateAndSetListName(e.target.value);
                                    }}
                                    placeholder={SWYM_CONFIG.defaultWishlistName}
                                    value={wishlistName}
                                />
                                <span className="error-msg" role="alert">
                                    {error}
                                </span> 
                            </div>
                            <div className='swym-hl-modal-action'>
                                <button className='swym-hl-bg-outline swym-hl-modal-action-btn' onClick={hideCreateNewList} >cancel</button>
                                <button className='swym-hl-bg-color swym-hl-modal-action-btn swym-hl-text-color' onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); createListByName()}}> <Loader width={20} showLoading={showLoading} /> Create</button>
                            </div>
                        </div>
                    )}
                    {!showCreateNewList && (
                        <div>
                            <div className="swym-wishlist-items">
                                <div className="swym-wishlist-items-title" role="radiogroup">Add To List</div>
                                { ( !savedList || !savedList.length  ) && <Loader showLoading={showListLoading} /> }
                                {savedList &&
                                savedList.length > 0 &&
                                savedList.map(({lname, lid}, index) => {
                                    return (
                                    <WishlistNameItem
                                        key={lid}
                                        name={lname}
                                        id={lid}
                                        index={index}
                                    />
                                    );
                                })}
                            </div>
                            <div className='swym-hl-modal-action'>
                                <button className='swym-hl-bg-outline swym-hl-modal-action-btn' onClick={createNewList} >Create New List</button>
                                <button className='swym-hl-bg-color swym-hl-modal-action-btn swym-hl-text-color' onClick={()=>addProductToWishlist()}> <Loader width={20} showLoading={showLoading} /> Add To List</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}