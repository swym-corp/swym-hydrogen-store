# Swym-Hydrogen Store

 Swym-Hydrogen Store is an implementation of the `Swym Wishlist` with Hydrogen. Hydrogen is Shopify's React framework and SDK that we can use to build fast and dynamic Shopify custom storefronts.

 In this implementation we are using the Swym Wishlist APIs and integrate it with the custom storefront of hydrogen while still using Shopify's backend support. We can use our Wishlist App for various functions including - 
 - Add Products to list
 - Create Multiple list
 - Delete product from list
 - Share list via:
   - Email
   - Copy Link

[To know more about Hydrogen you can check this doc](https://shopify.dev/custom-storefronts/hydrogen)

[Check out our API Docs](https://api-docs.swym.it/v3/#rest-apis)

[Here's a demo store with Swym Wishlist already setup](https://swym-hydrogen-store.vercel.app)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

## Running the dev server

Then `cd` into the new directory and run:

```bash
npm install
npm run dev
```

Remember to update `hydrogen.config.js` with your shop's domain and Storefront API token!

## Building for production

```bash
npm run build
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `npm run preview`:

```bash
npm run build
npm run preview
```

## Getting started with the swym wishlisht implementation on hydrogen

Here are some docs which will be helpful in the implementation

- <a href="https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started/quickstart" target="_blank">Getting started with Hydrogen</a>
- <a href="https://github.com/swym-corp/swym-hydrogen-store/wiki/How-to-link-your-shopify-account-with-hydrogen-storefront" target="_blank">How to link your shopify account with hydrogen storefront</a>
- <a href="https://swym-corp.github.io/hydrogen-docs/#0" target="_blank">Setting up swym wishlist code for the hydrogen store</a>
- <a href="https://github.com/swym-corp/swym-hydrogen-store/wiki/Wishlist-Code-Overview" target="_blank">A brief overview of Wishlist code used for this implementation</a>

## Deployment 
- We have deployed our demo hydrogen store using vercel
