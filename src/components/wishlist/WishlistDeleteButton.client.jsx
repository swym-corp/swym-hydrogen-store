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
      text-gray-500	top-0 right-0 
                  m-4
                  text-xs bg-black-600 z-10"
      onClick={handleOnClick}
    >
      <IconClose />
    </Button>
  );
}
