import {useEffect, useState, useContext} from 'react';
import {Dialog} from '@headlessui/react';
import {Button, IconClose} from '../index';
import './wishlistAddToModal.css';
import STRINGS from './Utils/strings';
import {
  callFetchPublicListAPI,
  callShareEmailAPI,
  callCopyLinkAPI,
} from '../../swym/wishlistPage-apis';
import {DataContext} from './wishlist-context';
import {
  getFullUserName,
  getSharedURL,
  validateEmail,
} from './Utils/utilsFunction';
import SwymAlert from '../../swym/Alert';
import SWYM_CONFIG from '../../swym/swym.config';

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

/*
  @author: swym
  @notice: a modal that pops up when clicking the 'share wishlist' button
  @dev:    handles wishlist sharing - share wishlist via email and copying link
  @param:  onPopupToggle fn
  @param:  lid(list id) string
*/

export function ShareWishlist({onPopupToggle, lid}) {
  const [senderName, setSenderName] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [publicLid, setPublicLid] = useState('');
  const [showAlertBox, setshowAlertBox] = useState(false);
  const [alertBoxTitle, setalertBoxTitle] = useState('');
  const [alertBoxInfo, setalertBoxInfo] = useState('');
  const [alertBoxType, setalertBoxType] = useState('');
  const [shareListLoading, setShareListLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const {
    setShareListSenderName,
    setSenderEmail,
    shareListSenderName,
    senderEmail,
  } = useContext(DataContext);
  let hostName = window.location.host;
  let medium = SWYM_CONFIG.swymSharedMediumCopyLink;
  let sharedurl = getSharedURL(hostName, publicLid);
  useEffect(() => {
    callMarkListPublicAPI();
  }, [lid]);

  const classNameInput = classNames(
    'swym-share-wishlist-email-btn swym-button swym-button-1 swym-is-button swym-bg-2 swym-color-4 ',
    buttonDisabled && 'swym-disabled',
  );

  const callMarkListPublicAPI = () => {
    callFetchPublicListAPI(lid).then((response) => {
      setPublicLid(response?.lid);
      setShareListSenderName(
        getFullUserName(response?.userinfo?.fname, response?.userinfo?.lname),
      );
      setSenderEmail(response?.userinfo?.em);
    });
  };

  const callShareViaEmail = (e) => {
    e.preventDefault();
    setShareListLoading(true);
    callShareEmailAPI(publicLid, senderName, emailValue)
      .then((response) => {
        if (response?.errors) {
          setshowAlertBox(true);
          setalertBoxType('error');
          setalertBoxTitle('Error');
          setalertBoxInfo('Email Not Sent');
        } else {
          setshowAlertBox(true);
          setalertBoxTitle('Success!');
          setalertBoxInfo('Email Sent Successfully');
          setalertBoxType('success');
        }
      })
      .catch((e) => {
        setshowAlertBox(true);
        setalertBoxType('error');
        setalertBoxTitle('Error');
        setalertBoxInfo('Email Not Sent');
      })
      .finally(() => {
        setShareListLoading(false);
      });
  };

  const callCopyLink = (e) => {
    e.preventDefault();
    callCopyLinkAPI(publicLid, medium, sharedurl, shareListSenderName).then(
      (response) => {
        let sharedurl = getSharedURL(hostName, response?.lid);
        navigator.clipboard
          .writeText(sharedurl)
          .then(() => {
            setshowAlertBox(true);
            setalertBoxTitle('Success!');
            setalertBoxInfo('Link Copied');
            setalertBoxType('success');
          })
          .catch(() => {
            setshowAlertBox(true);
            setalertBoxTitle('Error!');
            setalertBoxInfo('Link could not be copied');
            setalertBoxType('error');
          });
      },
    );
  };

  const onChangeEmail = (e) => {
    setEmailValue(e.target.value);
    const isInvalid = validateEmail(
      e.target.value,
      STRINGS.ValidationErrorEmail,
    );
    setEmailError(isInvalid);
    if (isInvalid) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  return (
    <div>
      <SwymAlert
        open={showAlertBox}
        toggleAlertState={setshowAlertBox}
        title={alertBoxTitle}
        info={alertBoxInfo}
        type={alertBoxType}
      />
      <Dialog
        open={true}
        onClose={() => onPopupToggle(false)}
        className={
          'fixed inset-0 z-10 overflow-y-auto flex justify-center items-center w-screen'
        }
      >
        <div className="flex shadow-xl flex-col bg-white text-black width-36 swym-responsive">
          <div className="flex">
            <h3
              className="text-xl font-bold flex-1"
              style={{
                padding: '14px',
                paddingLeft: '40px',
                fontSize: '18px',
                paddingTop: '30px',
              }}
            >
              Share Wishlist
            </h3>
            <button
              className="text-right"
              style={{padding: '14px', paddingTop: '30px', fontSize: '16px'}}
              onClick={() => onPopupToggle(false)}
            >
              <IconClose stroke="black" style={{float: 'right'}} />
            </button>
          </div>

          <Dialog.Panel>
            <div className="swym-share-wishlist-modal-dialog">
              <label className="swym-input-label">
                {STRINGS.ShareWishlistSenderName}
              </label>
              <div className="swym-input-label">
                <input
                  type="text"
                  placeholder={STRINGS.ShareWishlistNamePlaceholder}
                  id="swym-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="swym-share-wishlist-email swym-input swym-no-zoom-fix swym-input-1"
                />
              </div>

              <label className="swym-input-label">
                {STRINGS.ShareWishlistRecipientsEmail}
              </label>
              <div className="swym-input-label">
                <input
                  type="text"
                  placeholder={STRINGS.ShareWishlistEmailPlaceholder}
                  id="swym-email"
                  value={emailValue}
                  onChange={(e) => onChangeEmail(e)}
                  className="swym-share-wishlist-name swym-input swym-no-zoom-fix swym-input-1"
                />
                {emailError && (
                  <span className="error-msg" role="alert">
                    {emailError}
                  </span>
                )}
              </div>
              <div className="swym-share-email-button-container">
                <Button
                  className={classNameInput}
                  loading={shareListLoading}
                  onClick={(e) => callShareViaEmail(e)}
                  // disabled={buttonDisabled}
                >
                  {STRINGS.ShareWishlistEmailCTA}
                </Button>
              </div>
              <div className="swym-share-wishlist-separator"></div>
              <div className="flex justify-items-start">
                <h3
                  className="text-xl font-bold flex-none"
                  style={{fontSize: '16px'}}
                >
                  {STRINGS.ShareWishlistAlternateShareLabel}:
                </h3>
                <button
                  className="border-0 flex-1 justify-self-start"
                  style={{maxWidth: 'fit-content', paddingLeft: '10px'}}
                  onClick={(e) => callCopyLink(e)}
                >
                  {STRINGS.ShareWishlistCopyLinkText}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
