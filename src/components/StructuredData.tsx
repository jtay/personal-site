import { Helmet } from 'react-helmet-async';
import { getAbsoluteUrl } from '../utils/url';

interface ArticleStructuredDataProps {
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified: string;
    author: {
        name: string;
        url?: string;
    };
    url: string;
}

export function ArticleStructuredData({
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    url,
}: ArticleStructuredDataProps) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        image: image ? [image] : undefined,
        datePublished,
        dateModified,
        author: {
            '@type': 'Person',
            name: author.name,
            url: author.url,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Jaydon Taylor',
            logo: {
                '@type': 'ImageObject',
                url: getAbsoluteUrl('assets/jaydon.jpg'),
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
