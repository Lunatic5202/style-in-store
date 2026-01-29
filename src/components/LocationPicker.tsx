import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Icon } from "leaflet";
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

// Fix for default marker icon
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LocationPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentLocation: LocationData | null;
};

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapContent({ 
  center, 
  selectedLocation, 
  onLocationChange 
}: { 
  center: [number, number]; 
  selectedLocation: { lat: number; lng: number } | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onLocationChange={onLocationChange} />
      <MapCenterUpdater center={center} />
      {selectedLocation && (
        <Marker 
          position={[selectedLocation.lat, selectedLocation.lng]} 
          icon={markerIcon}
        />
      )}
    </MapContainer>
  );
}

export function LocationPicker({ isOpen, onClose, onLocationSelect, currentLocation }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [mode, setMode] = useState<"current" | "custom">("current");
  const [mapReady, setMapReady] = useState(false);
  
  const defaultCenter: [number, number] = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude] 
    : [22.5726, 88.3639]; // Kolkata default

  useEffect(() => {
    if (isOpen && currentLocation) {
      setSelectedLocation({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      setLocationName(currentLocation.area);
      // Delay map render to ensure dialog is fully mounted
      const timer = setTimeout(() => setMapReady(true), 100);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setMapReady(false);
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
          <div className="h-64 rounded-lg overflow-hidden border border-border">
            {mapReady ? (
              <MapContent
                center={mapCenter}
                selectedLocation={selectedLocation}
                onLocationChange={handleMapClick}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
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
