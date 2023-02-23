import {Buffer} from 'buffer';
import swymConfig from '../../swym/swym.config';
import {CacheNone, gql} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '../../lib/fragments';

/*
  @author: swym
  @notice: This will call swym APIs and sync regid with useremail after user log-in
  @dev:    Post request that use accesstoken to fetch user email and sync user activities done before login
  @param:  headers.cookie.__session to get customerAccessToken
  @param:  useragenttype mobile/desktop
  @param:  regid previously genrated regid
*/

export async function api(_request, {queryShop}) {
  console.log('-------calling swym api validate-regid ------');
  try {
    const parsedRequest = await _request.json();
    const {regid, useragenttype} = parsedRequest;
    const accessKey = swymConfig.REST_API_KEY;
    const pid = swymConfig.PID;
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
    if (!useremail) {
      return {
        error: true,
        msg: `Unable to get useremail. Check request cookie`,
      };
    }
    const urlencoded = new URLSearchParams();
    urlencoded.append('useragenttype', useragenttype);
    urlencoded.append('useremail', useremail);
    urlencoded.append('regid', regid);

    const URL = `${swymConfig.ENDPOINT}storeadmin/v3/user/guest-validate-sync?appId=Wishlist`;

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

    try {
      console.log('calling fetch', config);
      const res = await fetch(URL, config);
      const jsonValue = await res.json(); // Get JSON value from the response body
      console.log('internal API response', jsonValue);
      if (res.ok) {
        return jsonValue;
      } else {
        console.log(here);
        return {
          error: true,
          msg: JSON.stringify(res),
          urlencoded: data,
        };
      }
    } catch (e) {
      console.log('---------Exception--------');
      console.log(JSON.stringify(e));
      return {error: true, msg: JSON.stringify(e)};
    }
  } catch (e2) {
    console.log('---------Exception 2--------');
    console.log(JSON.stringify(e2));
    return {error: true, msg: JSON.stringify(e2)};
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
