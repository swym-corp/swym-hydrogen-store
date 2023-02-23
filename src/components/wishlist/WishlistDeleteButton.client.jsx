import {useState} from 'react';

import {Button} from '~/components';
import {IconClose} from '../index';

/*
  @author:  swym
  @notice: delete Btn on top right of product 
  @dev:    - 
  @param:  onClick fn
*/

export function WishlistDeleteButton({onClick}) {
  const [loading, setLoading] = useState(false);
  const handleOnClick = (params) => {
    setLoading(true);
    onClick(params);
  };
  return (
    <Button
      loading={loading}
      className="absolute 
              text-white	
                  inline-block top-0 right-0 
                  bottom-auto left-auto 
                  m-4
                  p-2.5
                  text-xs bg-black-600 rounded-full z-10 border-2 border-white"
      onClick={handleOnClick}
    >
      <IconClose />
    </Button>
  );
}
