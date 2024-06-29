import clsx from 'clsx';
import {
  flattenConnection,
  Image,
  Link,
  Money,
  useMoney,
  useUrl,
} from '@shopify/hydrogen';

import {Text} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import { WishlistButton } from '../wishlist/wishlistButton/wishlistButton.client';

export function ProductCard({product, label, className, loading, onClick}) {
  let { origin } = useUrl();
  let cardLabel;

  const cardData = product?.variants ? product : getProductPlaceholder();

  const {
    image,
    priceV2: price,
    compareAtPriceV2: compareAtPrice,
  } = flattenConnection(cardData?.variants)[0] || {};

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const styles = clsx('grid gap-6', className);

  const getProductId = () => {
    if (product?.id) {
      return +product?.id.split('Product/')[1];
    }
  };

  const getProductVariantId = () => {
    if (product?.variants?.nodes[0]?.id) {
      let variantId = product.variants.nodes[0].id;
      return +variantId.split('ProductVariant/')[1];
    }
  };

  const getProductUrl = () => {
    if (product?.handle) {
      return origin + '/products/'+ product.handle;
    }
  }

  const getProductImageUrl = () => {
    if (product?.featuredImage) {
      return product.featuredImage.url;
    }
  }

  return (
    <Link onClick={onClick} to={`/products/${product.handle}`}>
      <div className={styles}>
        <div className="card-image aspect-[4/5] bg-primary/5">
          <Text
            as="label"
            size="fine"
            className="absolute top-0 right-0 m-4 text-right text-notice"
          >
            {cardLabel}
          </Text>
          {image && (
            <Image
              className="aspect-[4/5] w-full object-cover"
              widths={[320]}
              sizes="320px"
              loaderOptions={{
                crop: 'center',
                scale: 2,
                width: 320,
                height: 400,
              }}
              // @ts-ignore Stock type has `src` as optional
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
          )}
        </div>
        <div className="grid gap-1">
          <WishlistButton variantId={getProductVariantId()} productId={getProductId()} productUrl={getProductUrl()} productImageUrl={getProductImageUrl()} product={product} buttonType={'icon'} addToMultiList={true} />
          <Text
            className="w-full overflow-hidden whitespace-nowrap text-ellipsis "
            as="h3"
          >
            {product.title}
          </Text>
          <div className="flex gap-4">
            <Text className="flex gap-4">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted(price, compareAtPrice) && (
                <CompareAtPrice
                  className={'opacity-50'}
                  data={compareAtPrice}
                />
              )}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
