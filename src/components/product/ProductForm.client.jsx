import {useEffect, useCallback, useState} from 'react';

import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen';

import {Heading, Text, Button, ProductOptions} from '~/components';
import { WishlistButton } from '../wishlist/wishlistButton/wishlistButton.client';
import SwymAlert from '../wishlist/common/Alert';
import {getWishlistSocialCount} from '../../swym/api/store-apis';
import {getSwymLocalStorage, setSwymLocalStorage} from '../../swym/Utils/Utils';

export function ProductForm({productData}) {
  const {pathname, search, origin } = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  const isOnSale =
    selectedVariant?.priceV2?.amount <
      selectedVariant?.compareAtPriceV2?.amount || false;

  const [socialCount, setSocialCount] = useState();
  /**
   * The function fetches data from API or cache and sets the count on the UI
   * @param {Boolean} skipCache - if picking data from cache should be skipped
   */
  async function setWishlistSocialCount(skipCache){
    try {
        const productGQLId = productData.product.id;
        const productId = productGQLId.split("/")[4];
        const res = await getWishlistSocialCount({empi: productId}, skipCache);
        if(res?.data?.count){
          setSocialCount(res.data.count);
        }else{
          setSocialCount(0);
        }
      } catch (error) {
        console.log(error);
        setSocialCount(0);
      }
  }
  
  useEffect(() => {
    setWishlistSocialCount();
  },[]);

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffect(() => {
    options.map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions[name].toLowerCase()),
        ),
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
      }
    });
  }, []);

  const handleChange = useCallback(
    (name, value) => {
      setSelectedOption(name, value);
      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  const getProductId = () => {
    if (productData?.product?.id) {
      return +productData?.product?.id.split('Product/')[1];
    }
  };

  const getProductVariantId = () => {
    if (selectedVariant?.id) {
      return +selectedVariant?.id.split('ProductVariant/')[1];
    }
  };

  const getProductUrl = () => {
    if (productData?.product?.handle) {
      return origin + '/products/'+ productData.product.handle;
    }
  }

  const getProductImageUrl = () => {
    if (productData?.product?.featuredImage) {
      return productData.product.featuredImage.url;
    }
  }

  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({name, values}) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  <ProductOptions
                    name={name}
                    handleChange={handleChange}
                    values={values}
                  />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div className="grid items-stretch gap-4">
        <AddToCartButton
          variantId={selectedVariant?.id}
          quantity={1}
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
          type="button"
        >
          <Button
            width="full"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            as="span"
          >
            {isOutOfStock ? (
              <Text>Sold out</Text>
            ) : (
              <Text
                as="span"
                className="flex items-center justify-center gap-2"
              >
                <span>Add to bag</span> <span>·</span>{' '}
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.priceV2}
                  as="span"
                />
                {isOnSale && (
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant.compareAtPriceV2}
                    as="span"
                    className="opacity-50 strike"
                  />
                )}
              </Text>
            )}
          </Button>
        </AddToCartButton>
        <WishlistButton variantId={getProductVariantId()} productId={getProductId()} productUrl={getProductUrl()} productImageUrl={getProductImageUrl()} product={productData.product} buttonType={'icontext'} addToMultiList={true} />
        <p>This item has been wishlisted {socialCount} times!</p>
      </div>
    </form>
  );
}
