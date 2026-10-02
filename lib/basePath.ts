/**
 * Utilities for handling base paths in static deployments (e.g. GitHub Pages).
 * On GitHub Pages (https://brainlife.github.io/docs-next/), assets must be prefixed
 * with the repository subpath unless a custom domain is configured.
 */

export const BASE_PATH =
    process.env.NEXT_PUBLIC_BASE_PATH !== undefined
        ? process.env.NEXT_PUBLIC_BASE_PATH
        : process.env.NODE_ENV === 'production'
        ? '/docs-next'
        : '';

/**
 * Prepends the deployment base path to a root-relative asset path.
 * Example: getAssetPath('/img/ezbids/Levitas_etal.png') -> '/docs-next/img/ezbids/Levitas_etal.png'
 */
export function getAssetPath(path: string | undefined | null): string {
    if (!path) return '';
    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('data:') ||
        path.startsWith('blob:')
    ) {
        return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (BASE_PATH && cleanPath.startsWith(BASE_PATH)) {
        return cleanPath;
    }
    return `${BASE_PATH}${cleanPath}`;
}
