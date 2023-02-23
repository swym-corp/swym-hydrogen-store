/* eslint-disable jsx-a11y/no-redundant-roles */
import {useContext, useEffect, useState} from 'react';
import {Dialog} from '@headlessui/react';
import {AddToWishlist, createList, fetchList} from '../../swym/store-apis';
import SWYM_CONFIG from '../../swym/swym.config';
import WishlistItem from './WishlistItem.client';
import {DataContext} from './wishlist-context';
import {Button, IconClose} from '../index';
import './wishlistAddToModal.css';

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

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

function CreateList({
  title,
  productId,
  productVariantId,
  onPopupToggle,
  image,
  setshowAlertBox,
  setalertBoxInfo,
  setalertBoxTitle,
  setalertBoxType,
}) {
  let [customListName, setcustomListName] = useState('');
  const {
    selectedCustomNameIndex,
    setselectedCustomNameIndex,
    savedList,
    setsavedList,
    WishlistText,
    setWishlistText,
  } = useContext(DataContext);
  const [openNewWishlistModal, setOpenNewWishlistModal] = useState(false);
  const [addToWishlistLoading, setaddToWishlistLoading] = useState(false);
  const [createListLoading, setcreateListLoading] = useState(false);
  const [wishlistName, setWishlistName] = useState('');
  const [error, setError] = useState();
  const className = 'swym-new-wishlist-item';

  const classNameInput = classNames(
    'swym-new-wishlist-name swym-no-zoom-fix swym-input',
    error && 'swym-input-has-error',
  );

  // const createListByName = async () => {
  //   setOpenNewWishlistModal(true);
  // };

  const createListByName = async () => {
    if (!error) {
      try {
        setcreateListLoading(true);
        const res = await createList(wishlistName);
        setcreateListLoading(false);
        if (res.di) {
          setsavedList([...savedList, res]);
          setshowAlertBox(true);
          setalertBoxType('success');
          setalertBoxTitle('Success');
          setalertBoxInfo('List Created');
          setWishlistName('');
          return res;
        } else {
          setshowAlertBox(true);
          setalertBoxType('error');
          setalertBoxTitle('Error');
          setalertBoxInfo('List not created');
        }
      } catch (e) {
        console.log('Exception', e);
        setalertBoxType('error');
        setshowAlertBox(true);
        setalertBoxTitle('Error');
        setalertBoxInfo('List not created');
      }
    } else {
      setshowAlertBox(true);
      setalertBoxType('error');
      setalertBoxTitle('Failed');
      setalertBoxInfo('List not created');
      setWishlistName('');
    }
  };
  useEffect(() => {
    // debugger
    getSetList();
  }, []);

  const getSetList = async () => {
    try {
      setaddToWishlistLoading(true);
      setcreateListLoading(true);
      const res = await fetchList();
      setaddToWishlistLoading(false);
      setcreateListLoading(false);
      if (res && res.length > 0) {
        setsavedList(res);
        setselectedCustomNameIndex(0);
      }
      console.log('this is', res);
    } catch (e) {
      console.log('Exception', e);
    }
  };

  const addProductToWishlist = async () => {
    const productUrl = window.location.href;
    try {
      let selectedListName = savedList[selectedCustomNameIndex]?.lid;
      if (wishlistName && wishlistName.length > 0) {
        let newList = await createListByName();
        selectedListName = newList.lid;
      }
      setaddToWishlistLoading(true);
      const res = await AddToWishlist(
        productId,
        productVariantId,
        productUrl,
        selectedListName,
      );
      setaddToWishlistLoading(false);
      if (res?.a) {
        setshowAlertBox(true);
        setalertBoxType('success');
        setalertBoxTitle('Success');
        setalertBoxInfo('Product addded to wishlist');
        setsavedList(res);
        onPopupToggle(false);
      } else {
        setshowAlertBox(true);
        setalertBoxType('error');
        setalertBoxTitle('Error');
        setalertBoxInfo('Product not added to wishlist');
      }
    } catch (e) {
      console.log('Exception', e);
      setaddToWishlistLoading(false);
      setshowAlertBox(true);
      setalertBoxType('error');
      setalertBoxTitle('Error');
      setalertBoxInfo('Product not added to wishlist');
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

  return (
    <Dialog
      open={true}
      onClose={() => onPopupToggle(false)}
      className={
        'fixed inset-0 z-10 overflow-y-auto flex justify-center items-center w-screen'
      }
    >
      <div className="flex shadow-xl flex-col bg-white text-black width-36 swym-responsive">
        <button
          className="text-right"
          style={{padding: '14px', fontSize: '16px'}}
          onClick={() => onPopupToggle(false)}
        >
          <IconClose stroke="black" style={{float: 'right'}} />
        </button>
        <Dialog.Panel>
          <div className="swym-modal-content">
            <div className="swym-add-wishlist-selector">
              <div
                className="swym-product-title swym-title-new"
                style={{padding: '20px 0px', alignItems: 'center'}}
              >
                {image && (
                  <div className="swym-product-image">
                    <img src={image} alt="" />
                  </div>
                )}
                <h3 className="swym-product-name swym-heading swym-heading-1 swym-title-new">
                  {title}
                </h3>
              </div>
              <div className="swym-wishlist-items">
                <div className="swym-wishlist-items-title" role="radiogroup">
                  Add To List
                </div>
                {savedList &&
                  savedList.length > 0 &&
                  savedList.map(({lname, lid}, index) => {
                    return (
                      <WishlistItem
                        key={lid}
                        name={lname}
                        id={lid}
                        index={index}
                      />
                    );
                  })}
              </div>
              <div className={className}>
                <div className="swym-new-wishlist-input-container">
                  <input
                    type="text"
                    className={classNameInput}
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
              </div>

              <div className="swym-action-btns">
                <Button
                  type="button"
                  loading={createListLoading}
                  onClick={createListByName}
                  style={{background: '#CACBCF', borderRadius: 0}}
                  className="swym-new-wishlist-btn swym-button swym-button-2 swym-color-2 swym-border-color-1 swym-border-button"
                >
                  Create New Wishlist
                </Button>
                <Button
                  type="button"
                  loading={addToWishlistLoading}
                  onClick={addProductToWishlist}
                  className="swym-add-to-list-btn swym-button swym-button-1 swym-bg-2 swym-color-4"
                >
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default CreateList;
