import React, {useEffect, useState} from 'react';
import {getWishlistSocialCount} from '../../swym/store-apis';
import './SocialCountSection.css';

/**
 * @author swym
 * @param {*} productData - This contains information about the product
 * @returns JSX for Social Count Section on PDP
 */
export default function SocialCountSection({socialCount}) {

  return (
    <div className="social-count-section">
      <span className="social-count-section__key-text">Social Count:</span>
      <span className="social-count-section__count">
        {
          socialCount 
        }
      </span>
    </div>
  );
}
