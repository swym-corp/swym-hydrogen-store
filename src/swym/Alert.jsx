import React, {useEffect} from 'react';
import {IconClose, IconTick} from '../components/index';
import SWYM_CONFIG from './swym.config';

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

  let IconComp = IconTick;

  if (type == 'error') {
    IconComp = () => (
      <div className="bg-red-500	text-white rounded-full p-1">
        <IconClose />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setshowAlert(false)}
      x-show="open"
      className="fixed
    top-36 right-4 z-50
    rounded-md bg-white
    shadow-xl text-left	
    px-4 py-2 text-white transition w-80
    text-black"
      style={{minWidth: '250px'}}
    >
      <div className="flex items-center space-x-2">
        {image?(
          <span>
            <img src={image} className="border rounded-full w-10" />
          </span>
        ):(<IconComp />)}
        <div>
          <p className="text-aligh">{title}</p>
          <p className="text-gray-500">{info}</p>
        </div>
      </div>
    </button>
  );
};

export default SwymAlert;
