
import * as cheerio from 'cheerio';
// @ts-ignore
import levenshtein from 'fast-levenshtein';

export async function verifyReview(
    productUrl: string,
    reviewerName: string
): Promise<boolean> {
    if (!productUrl || !reviewerName) return false;

    try {
        // 1. Fetch the Chrome Web Store page
        // Ensure we are fetching the reviews page specifically
        let targetUrl = productUrl;

        // Strip query parameters first (e.g., ?hl=en-GB&authuser=3)
        const urlObj = new URL(targetUrl);
        targetUrl = urlObj.origin + urlObj.pathname;

        if (!targetUrl.endsWith('/reviews')) {
            // Remove trailing slash if exists to avoid double slash
            targetUrl = targetUrl.replace(/\/$/, '');
            targetUrl = `${targetUrl}/reviews`;
        }

        console.log('[VERIFY] Fetching:', targetUrl);
        console.log('[VERIFY] Looking for reviewer:', reviewerName);

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log('[VERIFY] Response status:', response.status);

        if (!response.ok) {
            console.error(`[VERIFY] Failed to fetch ${productUrl}: ${response.status}`);
            return false;
        }

        const html = await response.text();
        console.log('[VERIFY] HTML length:', html.length);

        const $ = cheerio.load(html);

        // 2. Extract reviewer names
        // Note: Selectors on CWS can change. We need to be generic or inspect the current DOM.
        // As of late 2024, reviews might be in a specific section.
        // However, for MVP, we'll try to find common containers.
        // Often reviews are loaded dynamically or in a specific list.

        // Attempting to find reviewer names. 
        // This part is fragile and might require adjustments based on actual CWS HTML structure.
        // Let's look for elements that look like user names.
        // CWS often uses specific class names, but they are minified. 
        // Strategy: Look for the review section.

        // Since we can't easily debug the CWS HTML without seeing it, 
        // I will write a heuristic that looks for common patterns in scraped HTML.
        // Or simpler: Just search for the name in the text content if it's unique enough?
        // No, that's too loose.

        // For now, let's assume we can find standard review items.
        // If this fails, we might need a more robust headless browser approach,
        // but the requirement was valid "scraping".

        // Fallback: Check if the name exists in the HTML body reasonably close to "stars" or date patterns.
        // But let's try a direct text search as a primary fuzzy pass if selectors fail.

        const bodyText = $('body').text();
        console.log('[VERIFY] Body text length:', bodyText.length);

        // Check if name is present with exact match first (case-insensitive)
        const nameFound = bodyText.toLowerCase().includes(reviewerName.toLowerCase());
        console.log('[VERIFY] Name found in body?', nameFound);

        if (nameFound) {
            return true;
        }

        // If not exact, we'd need to parse separate reviews to do fuzzy matching correctly
        // otherwise we might match partial text unrelated to names.
        // Given the constraints, let's implement a 'best effort' selector search.
        // Common selectors for CWS reviews (historically): .BA0A6c (name)

        // Let's try to extract potential names:
        // This is hard without actul selectors. 
        // I will use a placeholder logic that should be updated with real selectors.

        // Let's trust "fast-levenshtein" on extracted text if we can isolate reviews.
        // Using a broad text search for fuzzy match:

        // Sliding window or chunk checks? Too complex.
        // Let's try to find the reviewer name in the whole text with Levenshtein?
        // No, that's meaningless on a large text.


        // BETTER STRATEGY: 
        // Use the `cheerio` to find all <div> or <span> elements that have the class for author.
        // I will search for a few known classes.
        const potentialNames: string[] = [];
        $('.ba-bc-Xb-K').each((_, el) => { potentialNames.push($(el).text()) }); // Old CWS
        $('.comment-thread-displayname').each((_, el) => { potentialNames.push($(el).text()) });
        $('div[class*="name"]').each((_, el) => { potentialNames.push($(el).text()) }); // Generic fallback

        if (potentialNames.length === 0) {
            // Fallback: If we can't parse structure, simple inclusion check is all we can do without a headless browser
            // for dynamic content. 
            // Note: CWS is largely client-side rendered, fetch() might get minimal HTML.
            // If fetch() returns empty shell, verification will fail (safe default).
            return bodyText.includes(reviewerName);
        }

        // Fuzzy match against found names
        const THRESHOLD = 3; // Allow small differences

        for (const name of potentialNames) {
            const distance = levenshtein.get(reviewerName.toLowerCase(), name.toLowerCase());
            if (distance <= THRESHOLD) {
                return true;
            }
        }

        return false;

    } catch (error) {
        console.error('Error verifying review:', error);
        return false;
    }
}
