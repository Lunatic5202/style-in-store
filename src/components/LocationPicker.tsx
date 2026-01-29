import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, Navigation, Loader2, Check } from "lucide-react";
import { getCurrentLocation, type LocationData } from "@/lib/locationService";
import "leaflet/dist/leaflet.css";

// NOTE: We intentionally use Leaflet directly (not react-leaflet) to avoid
// React context consumer issues inside Radix Dialog portals in some Vite builds.

type LocationPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentLocation: LocationData | null;
};

export function LocationPicker({ isOpen, onClose, onLocationSelect, currentLocation }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [mode, setMode] = useState<"current" | "custom">("current");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    [],
  );
  
  const defaultCenter: [number, number] = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude] 
    : [22.5726, 88.3639]; // Kolkata default

  useEffect(() => {
    if (isOpen && currentLocation) {
      setSelectedLocation({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      setLocationName(currentLocation.area);
    }
  }, [isOpen, currentLocation]);

  const handleUseCurrentLocation = async () => {
    setIsLoadingCurrentLocation(true);
    try {
      const location = await getCurrentLocation();
      setSelectedLocation({ lat: location.latitude, lng: location.longitude });
      setLocationName(location.area);
      setMode("current");
    } catch (error) {
      console.error("Error getting current location:", error);
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setMode("custom");
    setIsReverseGeocoding(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const area = data.address?.suburb || 
                   data.address?.neighbourhood || 
                   data.address?.city_district ||
                   data.address?.city || 
                   "Selected location";
      setLocationName(area);
    } catch {
      setLocationName("Selected location");
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedLocation) return;
    
    let area = locationName;
    let city = "";
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
      );
      const data = await response.json();
      city = data.address?.city || data.address?.town || "";
    } catch {
      // Use existing data
    }
    
    onLocationSelect({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      area,
      city,
    });
    onClose();
  };

  const mapCenter: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : defaultCenter;

  // Create / destroy Leaflet map when dialog opens/closes.
  useEffect(() => {
    if (!isOpen) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
      return;
    }

    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(mapCenter, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      void handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    // Ensure correct sizing inside Dialog after it mounts.
    // Radix Dialog animates in; Leaflet can measure 0x0 initially.
    // A couple of delayed invalidations makes rendering reliable.
    const t1 = window.setTimeout(() => map.invalidateSize(), 0);
    const t2 = window.setTimeout(() => map.invalidateSize(), 150);
    const t3 = window.setTimeout(() => map.invalidateSize(), 500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keep map centered and marker updated.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setView(mapCenter, map.getZoom(), { animate: false });

    if (selectedLocation) {
      if (!markerRef.current) {
        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], {
          icon: markerIcon,
        }).addTo(map);
      } else {
        markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      }
    }
  }, [mapCenter, selectedLocation, markerIcon]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Delivery Location</DialogTitle>
          <DialogDescription>
            Use your current location or tap on the map to select a custom delivery address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={mode === "current" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={handleUseCurrentLocation}
              disabled={isLoadingCurrentLocation}
            >
              {isLoadingCurrentLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              Current Location
            </Button>
            <Button
              variant={mode === "custom" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setMode("custom")}
            >
              <MapPin className="w-4 h-4" />
              Choose on Map
            </Button>
          </div>

          {/* Map */}
          <div className="h-64 rounded-lg overflow-hidden border border-border bg-muted">
            <div ref={mapContainerRef} className="h-full w-full" />
          </div>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {isReverseGeocoding ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finding address...
                    </span>
                  ) : (
                    locationName
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <Button 
            className="w-full gap-2" 
            onClick={handleConfirm}
            disabled={!selectedLocation || isReverseGeocoding}
          >
            <Check className="w-4 h-4" />
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
