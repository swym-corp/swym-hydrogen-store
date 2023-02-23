import {Seo} from '@shopify/hydrogen';
import {Section, WishlistPage} from '~/components';
import {Layout} from '~/components/index.server';

export default function Wishlist() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'Wishlist'}} />
      <Section className="max-w-7xl mx-auto">
        <WishlistPage layout="page" />
      </Section>
    </Layout>
  );
}
