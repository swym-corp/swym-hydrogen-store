import './Alert.css';
import React, {useEffect} from 'react';
import SWYM_CONFIG from '../../../swym/swym.config';

/*
  @author:  swym
  @notice: Alert box that appear for short period on top right of website.
  @dev:    Feedback msg on API response ( success or fail )
  @param:  title - popup header
  @param:  info - alert box info
  @param:  open - render alert
  @param:  toggleAlertState - to hide/show popup
  @param:  type - error/success
*/

const IconClose = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={20}
    height={20}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="currentColor"
      d="M443.6 387.1 312.4 255.4l131.5-130c5.4-5.4 5.4-14.2 0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L256 197.8 124.9 68.3c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L68 105.9c-5.4 5.4-5.4 14.2 0 19.6l131.5 130L68.4 387.1c-2.6 2.6-4.1 6.1-4.1 9.8 0 3.7 1.4 7.2 4.1 9.8l37.4 37.6c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1L256 313.1l130.7 131.1c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1l37.4-37.6c2.6-2.6 4.1-6.1 4.1-9.8-.1-3.6-1.6-7.1-4.2-9.7z"
    />
  </svg>
)

const IconTick = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={20}
    height={20}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M434.8 49 174.2 309.7l-97.4-97.4L0 289.2l174.1 174.1 22.5-22.4 315.1-315.1L434.8 49z"
      style={{
        fill: "currentColor",
      }}
    />
  </svg>
)

const SwymAlert = ({title, info, image, open, toggleAlertState, type}) => {
  useEffect(() => {
    if (!open) {
      return;
    }
    const timeOut = setTimeout(() => {
      toggleAlertState(false);
    }, SWYM_CONFIG.alertTimeOut);

    // return () => clearTimeout(timeOut);
  }, [open]);

  if (!open) {
    return null;
  }

  let IconComp = () => (
    <div className="swym-hl-alert-success-icon">
        <IconTick />
      </div>
  );

  if (type == 'error') {
    IconComp = () => (
      <div className="swym-hl-alert-error-icon">
        <IconClose />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setshowAlert(false)}
      x-show="open"
      className="swym-hl-alert-container"
      style={{minWidth: '250px'}}
    >
      <div className="swym-hl-alert-content">
        {image?(
          <span>
            <img src={image} className="swym-hl-alert-img" />
          </span>
        ):(<IconComp />)}
        <div className='swym-hl-alet-info-container'>
          <p className="swym-hl-alert-title">{title}</p>
          <p className="swym-hl-alert-info">{info}</p>
        </div>
      </div>
    </button>
  );
};

export default SwymAlert;
