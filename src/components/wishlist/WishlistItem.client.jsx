import {useContext, useState} from 'react';
import {DataContext} from './wishlist-context';
import {getWishlistBadgeLetters} from './Utils/utilsFunction';

/*
  @author: swym
  @notice: list name label
  @dev:    component for list name
  @param:  name - name of list
  @param:  index - index of list
*/
function WishlistItem({name, index}) {
  const [isSelected, setIsSelected] = useState(false);
  const [selectBackground, setSelectBackground] = useState(false);
  const {selectedCustomNameIndex, setselectedCustomNameIndex} =
    useContext(DataContext);
  const className =
    'swym-wishlist-item swym-value swym-is-button swym-color-2 swym-hover-color-1';
  const letters = getWishlistBadgeLetters(name, 'MW');

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelected((prev) => !prev);
    setSelectBackground((prev) => !prev);
    if (selectedCustomNameIndex !== index) {
      setselectedCustomNameIndex(index);
    }
  };

  return (
    <div role="radiogroup">
      <button
        name="wishlist-options"
        className={className}
        onClick={(e) => {
          handleClick(e);
        }}
        role="radio"
        aria-checked={isSelected}
        aria-label={name}
        style={{
          borderBottom: '1px solid #CACBCF',
          paddingLeft: 0,
        }}
      >
        <span className="swym-wishlist-badge swym-bg-1 swym-bg-2 swym-color-4">
          {letters}
        </span>
        <span
          className="swym-wishlist-text"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <span className="swym-wishlist-name">{name}</span>
          <span>
            {' '}
            <input
              type="radio"
              checked={index === selectedCustomNameIndex}
              style={{accentColor: '#434655', color: '#035587'}}
              onChange={() => {
                if (selectedCustomNameIndex !== index) {
                  setselectedCustomNameIndex(index);
                }
              }}
            />{' '}
          </span>
        </span>
      </button>
    </div>
  );
}
export default WishlistItem;
