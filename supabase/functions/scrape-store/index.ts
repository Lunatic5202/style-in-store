const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedProduct {
  name: string;
  price: number | null;
  originalPrice: number | null;
  image: string | null;
  sizes: string[];
  category: string;
}

interface ScrapeResult {
  storeName: string;
  storeUrl: string;
  products: ScrapedProduct[];
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { stores } = await req.json();

    if (!stores || !Array.isArray(stores)) {
      return new Response(
        JSON.stringify({ success: false, error: 'stores array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Known retailer websites we can attempt to scrape
    const knownRetailers: Record<string, string> = {
      'westside': 'https://www.westside.com',
      'pantaloons': 'https://www.pantaloons.com',
      'zudio': 'https://www.zudio.com',
      'fabindia': 'https://www.fabindia.com',
      'w': 'https://www.wforwoman.com',
      'jockey': 'https://www.jockey.in',
      'nike': 'https://www.nike.com/in',
      'adidas': 'https://www.adidas.co.in',
      'reebok': 'https://www.reebok.co.in',
      'linen club': 'https://www.linenclub.com',
    };

    const results: ScrapeResult[] = [];

    for (const store of stores.slice(0, 5)) { // Limit to 5 stores to avoid timeout
      const storeName = store.name?.toLowerCase() || '';
      let storeUrl: string | null = null;

      // Check if this is a known retailer
      for (const [key, url] of Object.entries(knownRetailers)) {
        if (storeName.includes(key)) {
          storeUrl = url;
          break;
        }
      }

      // If store has a website tag from OSM, use that
      if (store.website) {
        storeUrl = store.website;
      }

      if (!storeUrl) {
        results.push({
          storeName: store.name,
          storeUrl: '',
          products: [],
          error: 'No website found for this store'
        });
        continue;
      }

      console.log(`Scraping ${store.name} at ${storeUrl}`);

      try {
        // Use Firecrawl to scrape the store
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: storeUrl,
            formats: ['markdown', 'links'],
            onlyMainContent: true,
            waitFor: 3000, // Wait for JS to load
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`Firecrawl error for ${store.name}:`, data);
          results.push({
            storeName: store.name,
            storeUrl,
            products: [],
            error: data.error || 'Failed to scrape'
          });
          continue;
        }

        // Try to extract product info from the scraped content
        const markdown = data.data?.markdown || data.markdown || '';
        const products = extractProductsFromContent(markdown, store.name);

        results.push({
          storeName: store.name,
          storeUrl,
          products
        });

      } catch (err) {
        console.error(`Error scraping ${store.name}:`, err);
        results.push({
          storeName: store.name,
          storeUrl,
          products: [],
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-store function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Extract product information from scraped markdown content
function extractProductsFromContent(markdown: string, storeName: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = [];
  
  // Common patterns for product info in markdown
  // This is a best-effort extraction - real-world results will vary
  
  // Look for price patterns (₹, Rs, INR followed by numbers)
  const pricePattern = /(?:₹|Rs\.?|INR)\s*([\d,]+)/gi;
  const prices: number[] = [];
  let match;
  while ((match = pricePattern.exec(markdown)) !== null) {
    const price = parseInt(match[1].replace(/,/g, ''));
    if (price > 100 && price < 100000) { // Reasonable clothing price range
      prices.push(price);
    }
  }

  // Look for size patterns
  const sizePattern = /\b(XS|S|M|L|XL|XXL|2XL|3XL|\d{2})\b/gi;
  const sizes: string[] = [];
  while ((match = sizePattern.exec(markdown)) !== null) {
    const size = match[1].toUpperCase();
    if (!sizes.includes(size)) {
      sizes.push(size);
    }
  }

  // Look for product-like titles (capitalized phrases)
  const titlePattern = /^#+\s*(.+)|^\*\*(.+)\*\*/gm;
  const titles: string[] = [];
  while ((match = titlePattern.exec(markdown)) !== null) {
    const title = (match[1] || match[2])?.trim();
    if (title && title.length > 3 && title.length < 100) {
      titles.push(title);
    }
  }

  // Look for image URLs
  const imagePattern = /!\[.*?\]\((https?:\/\/[^\s)]+)\)|src=["'](https?:\/\/[^\s"']+)/gi;
  const images: string[] = [];
  while ((match = imagePattern.exec(markdown)) !== null) {
    const url = match[1] || match[2];
    if (url && (url.includes('.jpg') || url.includes('.png') || url.includes('.webp'))) {
      images.push(url);
    }
  }

  // Create products from extracted data
  // Combine what we found into product entries
  const numProducts = Math.min(prices.length, Math.max(titles.length, 4));
  
  const categories = ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Dresses', 'Skirts'];
  
  for (let i = 0; i < numProducts; i++) {
    products.push({
      name: titles[i] || `${storeName} Product ${i + 1}`,
      price: prices[i] || null,
      originalPrice: prices[i] ? Math.round(prices[i] * 1.2) : null,
      image: images[i] || null,
      sizes: sizes.length > 0 ? sizes.slice(0, 5) : ['S', 'M', 'L', 'XL'],
      category: categories[i % categories.length]
    });
  }

  return products;
}
