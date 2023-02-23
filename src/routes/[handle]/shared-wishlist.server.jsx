import {Seo} from '@shopify/hydrogen';
import {Section} from '~/components';
import {Layout} from '~/components/index.server';
import {ShareWishlistPage} from '../../components/index';

export default function sharedWishlist() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'Shared Wishlist'}} />
      <Section className="max-w-7xl mx-auto">
        <ShareWishlistPage layout="page" />
      </Section>
    </Layout>
  );
}
