import React, {useEffect, useState} from 'react';
import {getWishlistSocialCount} from '../../swym/store-apis';
import './SocialCountSection.css';

/**
 * @author swym
 * @param {*} productData - This contains information about the product
 * @returns JSX for Social Count Section on PDP
 */
export default function SocialCountSection(productData) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    async function setSocialCount(){
        try {
            const productGQLId = productData.productData.product.id;
            const productId = productGQLId.split("/")[4];
            const res = await getWishlistSocialCount({ empi:productId });
            if(res?.data?.count)
              setCount(res.data.count);
          } catch (error) {
            console.log(error);
          }
    }
    setSocialCount();
  },[]);

  return (
    <div className="social-count-section">
      <span className="social-count-section__key-text">Social Count:</span>
      <span className="social-count-section__count">{count}</span>
    </div>
  );
}
