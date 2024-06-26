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
      className="absolute bg-black-600 bg-white border mt-1 p-2 right-1 rounded-full text-gray-500 text-xs top-0 w-auto z-10"
      onClick={handleOnClick}
    >
      <IconClose />
    </Button>
  );
}
