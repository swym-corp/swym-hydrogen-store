import {PRODUCT_CARD_FRAGMENT} from '../../lib/fragments';
import {gql} from '@shopify/hydrogen';

/*
  @author: swym
  @notice: This will get the customer access token from cookies when the user logs in
  @dev:    Post request take useremail or use uuid to return regid
  @param:  headers.cookie.__session to get customerAccessToken
  @param:  useragenttype mobile/desktop
*/

export async function api(_request, {queryShop}) {
  console.log('-------fetching cookie data ------');
  console.log('request headers', _request.headers);
  console.log('request headers', _request.headers.get('cookie'));
  try {
    const parsedCookie = parseCookie(_request.headers.get('cookie'));
    console.log('parsedCookie', parsedCookie);
    if (parsedCookie.__session) {
      const {customerAccessToken} = JSON.parse(parsedCookie.__session);
      console.log('customerAccessToken', customerAccessToken);
      return customerAccessToken;
    }
    return '';
  } catch (e) {
    console.log('Cookie parse error', e);
    return e;
  }
}
const CUSTOMER_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      phone
      email
      defaultAddress {
        id
        formatted
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
            phone
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
const parseCookie = (str) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
