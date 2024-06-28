import { AddToCartButton, ProductOptionsProvider } from '@shopify/hydrogen';
import './wishlistItem.css';

export default function wishlistItem({ productId, variantId, product, readOnly = true , onRemoveItem }){
    return (
        <div className='swym-hl-listitem'>
            <div className='swym-hl-wishlist-item-content'>
                <a className='' aria-label={product['dt']} href={product.cprops?.ou} >
                    <img
                        className="w-full"
                        alt={product['dt'] || 'Product Image'}
                        src={product['iu']}
                    />
                    <div className="swym-hl-list-item-title">{product['dt']}</div>
                    <div className='swym-hl-list-item-vendor'>{product['bt']}</div>
                    <div className="swym-hl-list-item-price">${product['pr']}</div>
                </a>
                <ProductOptionsProvider
                    data={{
                    id: `gid://shopify/Product/${productId}`,
                    title: product.dt,
                    vendor: product.bt,
                    variants: [
                        {
                        id: `gid://shopify/ProductVariant/${variantId}`,
                        },
                    ],
                    }}
                >
                    <AddToCartButton className='swym-hl-addtocart-btn swym-hl-bg-color swym-hl-text-color' variantId={`gid://shopify/ProductVariant/${variantId}`} >Add To Cart</AddToCartButton>
                </ProductOptionsProvider>
            </div>
            {!readOnly && (
                <div className='swym-hl-listitem-delete-btn' onClick={onRemoveItem}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlSpace="preserve"
                        width={12}
                        height={12}
                        viewBox="0 0 512 512"
                    >
                        <path fill="currentColor" d="M443.6 387.1 312.4 255.4l131.5-130c5.4-5.4 5.4-14.2 0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L256 197.8 124.9 68.3c-2.6-2.6-6.1-4-9.8-4-3.7 0-7.2 1.5-9.8 4L68 105.9c-5.4 5.4-5.4 14.2 0 19.6l131.5 130L68.4 387.1c-2.6 2.6-4.1 6.1-4.1 9.8 0 3.7 1.4 7.2 4.1 9.8l37.4 37.6c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1L256 313.1l130.7 131.1c2.7 2.7 6.2 4.1 9.8 4.1 3.5 0 7.1-1.3 9.8-4.1l37.4-37.6c2.6-2.6 4.1-6.1 4.1-9.8-.1-3.6-1.6-7.1-4.2-9.7z" />
                    </svg>
                </div>
            )}
        </div>
    )
}