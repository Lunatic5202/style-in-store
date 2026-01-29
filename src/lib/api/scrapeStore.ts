import { supabase } from "@/integrations/supabase/client";

export interface ScrapedProduct {
  name: string;
  price: number | null;
  originalPrice: number | null;
  image: string | null;
  sizes: string[];
  category: string;
}

export interface ScrapeResult {
  storeName: string;
  storeUrl: string;
  products: ScrapedProduct[];
  error?: string;
}

export interface ScrapeResponse {
  success: boolean;
  results?: ScrapeResult[];
  error?: string;
}

export async function scrapeStoreProducts(
  stores: Array<{ name: string; website?: string }>
): Promise<ScrapeResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("scrape-store", {
      body: { stores },
    });

    if (error) {
      console.error("Error calling scrape-store function:", error);
      return { success: false, error: error.message };
    }

    return data as ScrapeResponse;
  } catch (err) {
    console.error("Error scraping stores:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
