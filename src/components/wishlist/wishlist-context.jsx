import React, {createContext, useState} from 'react';

export const DataContext = createContext();

const WishlistContext = ({children}) => {
  const [selectedCustomNameIndex, setselectedCustomNameIndex] = useState(0);
  const [savedList, setsavedList] = useState([]);
  const [WishlistText, setWishlistText] = useState('Add');
  const [shareListSenderName, setShareListSenderName] = useState('SwymCorp');
  const [senderEmail, setSenderEmail] = useState('admin@swymcorp.com');

  return (
    <DataContext.Provider
      value={{
        selectedCustomNameIndex,
        setselectedCustomNameIndex,
        savedList,
        setsavedList,
        WishlistText,
        setWishlistText,
        shareListSenderName,
        setShareListSenderName,
        senderEmail,
        setSenderEmail,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default WishlistContext;
