import './shareListPopup.css';

import {useEffect, useState, useContext} from 'react';

import STRINGS from '../../../swym/Utils/strings';
import {
  callFetchPublicListAPI,
  callShareEmailAPI,
  callCopyLinkAPI,
} from '../../../swym/api/wishlistPage-apis';
import {DataContext} from '../wishlist-context';
import {
  getFullUserName,
  getSharedURL,
  validateEmail,
} from '../../../swym/Utils/utilsFunction';
import SwymAlert from '../common/Alert';
import SWYM_CONFIG from '../../../swym/swym.config';

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

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
  const [alertBox, setalertBox ] = useState({ type: 'success', title:'', info: '', image: '' });
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
          setalertBox({ type:'error', title: 'Error', info: 'Email Not Sent' });
        } else {
          setshowAlertBox(true);
          setalertBox({ type:'success', title: 'Success!', info: 'Email Sent Successfully' });
        }
      })
      .catch((e) => {
        setshowAlertBox(true);
        setalertBox({ type:'error', title: 'Error', info: 'Email Not Sent' });
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
            setalertBox({ type:'success', title: 'Success!', info: 'Link Copied' });
          })
          .catch(() => {
            setshowAlertBox(true);
            setalertBox({ type:'error', title: 'Error!', info: 'Link could not be copied' });
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
      <div id="swym-hl-share-list-popup" className="modal" onClick={(e)=> { e.preventDefault(); e.stopPropagation(); onPopupToggle(false) }}>
            <SwymAlert
                open={showAlertBox}
                toggleAlertState={setshowAlertBox}
                title={alertBox.title}
                info={alertBox.info}
                type={alertBox.type}
            />
            <div className="swym-hl-share-modal-content" onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
                <span className="swym-hl-share-modal-close-btn" onClick={()=>onPopupToggle(false)}>&times;</span>
                <div className="swym-hl-share-heading">
                    <h3>Share Wishlist</h3>
                </div>
                <div className="swym-hl-share-body">
                    <div className="swym-hl-share-content">
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
                    </div>
                    <div className='swym-hl-share-modal-action'>
                        <button className='swym-hl-bg-color swym-hl-share-modal-action-btn swym-hl-text-color' onClick={(e) => callShareViaEmail(e)}> <Loader width={20} showLoading={shareListLoading} /> {STRINGS.ShareWishlistEmailCTA} </button>
                        <button className='swym-hl-bg-outline swym-hl-share-modal-action-btn' onClick={(e) => callCopyLink(e)} >
                            <span style={{fontSize: '16px'}} > {STRINGS.ShareWishlistAlternateShareLabel}:</span>
                            {STRINGS.ShareWishlistCopyLinkText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
