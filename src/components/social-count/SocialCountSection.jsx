import React, {useEffect, useState} from 'react';
import {getWishlistSocialCount} from '../../swym/store-apis';
import './SocialCountSection.css';

export default function SocialCountSection(productData) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    async function setSocialCount(){
        try {
            const res = await getWishlistSocialCount(productData.productData.product.id.split('/')[4]);
            setCount(res.data.count);
          } catch (error) {
            console.log(error);
          }
    }
    setSocialCount();
  },[]);

  return (
    <div className="social-count-section">
      <span className="social-count-section__key-text">Social Count</span>
      <span className="social-count-section__count">{count}</span>
    </div>
  );
}
