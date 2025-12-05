import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/handler/',
                    '/_next/',
                    '/old-homepage',
                ],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/api/', '/admin/', '/handler/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/api/', '/admin/', '/handler/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/api/', '/admin/', '/handler/'],
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: ['/api/', '/admin/', '/handler/'],
            },
            {
                userAgent: 'Claude-Web',
                allow: '/',
                disallow: ['/api/', '/admin/', '/handler/'],
            },
        ],
        sitemap: 'https://vellore-directory.vercel.app/sitemap.xml',
        host: 'https://vellore-directory.vercel.app',
    };
}
