import {v4 as uuidv4} from 'uuid';
import {Buffer} from 'buffer';
import {PRODUCT_CARD_FRAGMENT} from '../../lib/fragments';
import {CacheNone, gql} from '@shopify/hydrogen';
import swymConfig from '../../swym/swym.config';

/*
  @author: swym
  @notice: This will call swym APIs and genrate regid for user
  @dev:    Post request take useremail or use uuid to return regid
  @param:  headers.cookie.__session to get customerAccessToken
  @param:  useragenttype mobile/desktop
*/

export async function api(_request, {queryShop}) {
  console.log('-------calling swym api generate-regid ------');
  let useremail;
  try {
    const parsedCookie = parseCookie(_request.headers.get('cookie'));
    const {customerAccessToken} = JSON.parse(parsedCookie.__session);
    const {data} = await queryShop({
      query: CUSTOMER_QUERY,
      variables: {
        customerAccessToken,
        language: 'EN',
        country: 'US',
      },
      cache: CacheNone(),
    });
    useremail = data?.customer?.email;
  } catch (e) {
    console.log('Cookie parse error', e);
  }
  const parsedRequest = await _request.json();
  const {useragenttype} = parsedRequest;

  const accessKey = swymConfig.REST_API_KEY;
  const pid = swymConfig.PID;
  const urlencoded = new URLSearchParams();
  urlencoded.append('useragenttype', useragenttype);
  console.log(typeof useremail);
  if (useremail != null && useremail != 'undefined' && useremail != undefined) {
    console.log('using useremail', useremail);
    urlencoded.append('useremail', useremail);
  } else {
    urlencoded.append('uuid', uuidv4());
  }
  const URL = `${swymConfig.ENDPOINT}storeadmin/v3/user/generate-regid?appId=Wishlist`;
  const config = {
    method: 'post',
    // url: URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${pid}:${accessKey}`).toString(
        'base64',
      )}`,
    },
    redirect: 'follow',
    body: urlencoded,
  };
  console.log('config', config);
  try {
    const res = await fetch(URL, config);
    // console.log('response', res);
    // console.log('response', res.body);
    const jsonValue = await res.json(); // Get JSON value from the response body
    console.log('internal API response', jsonValue);
    if (res.ok) {
      return jsonValue;
    } else {
      return {error: true};
    }
  } catch (e) {
    console.log('---------Exception--------');
    console.log(JSON.stringify(e));
    return {error: true};
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
