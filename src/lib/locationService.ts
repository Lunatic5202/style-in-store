export type NearbyStore = {
  id: number;
  name: string;
  distance: string;
  distanceMeters: number;
  deliveryTime: string;
  lat: number;
  lon: number;
  type: string;
  website?: string;
};

export type LocationData = {
  latitude: number;
  longitude: number;
  area: string;
  city: string;
};

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const area = data.address?.suburb || 
                       data.address?.neighbourhood || 
                       data.address?.city_district ||
                       data.address?.city || 
                       "your area";
          const city = data.address?.city || data.address?.town || "";
          
          resolve({ latitude, longitude, area, city });
        } catch {
          resolve({ latitude, longitude, area: "your area", city: "" });
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

function estimateDeliveryTime(meters: number): string {
  // Estimate ~3 min per km for delivery
  const minutes = Math.max(8, Math.round((meters / 1000) * 3) + 5);
  return `${minutes} min`;
}

export async function fetchNearbyStores(latitude: number, longitude: number, radiusMeters: number = 5000): Promise<NearbyStore[]> {
  // Overpass API query for clothing/fashion stores
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="clothes"](around:${radiusMeters},${latitude},${longitude});
      node["shop"="fashion"](around:${radiusMeters},${latitude},${longitude});
      node["shop"="boutique"](around:${radiusMeters},${latitude},${longitude});
      node["shop"="department_store"](around:${radiusMeters},${latitude},${longitude});
      way["shop"="clothes"](around:${radiusMeters},${latitude},${longitude});
      way["shop"="fashion"](around:${radiusMeters},${latitude},${longitude});
      way["shop"="boutique"](around:${radiusMeters},${latitude},${longitude});
      way["shop"="department_store"](around:${radiusMeters},${latitude},${longitude});
    );
    out center;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stores");
    }

    const data = await response.json();
    
    const stores: NearbyStore[] = data.elements
      .filter((el: any) => el.tags?.name) // Only stores with names
      .map((el: any) => {
        const storeLat = el.lat || el.center?.lat;
        const storeLon = el.lon || el.center?.lon;
        const distanceMeters = calculateDistance(latitude, longitude, storeLat, storeLon);
        
        return {
          id: el.id,
          name: el.tags.name,
          distance: formatDistance(distanceMeters),
          distanceMeters,
          deliveryTime: estimateDeliveryTime(distanceMeters),
          lat: storeLat,
          lon: storeLon,
          type: el.tags.shop || "clothes",
          website: el.tags.website || undefined,
        };
      })
      .sort((a: NearbyStore, b: NearbyStore) => a.distanceMeters - b.distanceMeters)
      .slice(0, 10); // Top 10 closest stores

    return stores;
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    return [];
  }
}
