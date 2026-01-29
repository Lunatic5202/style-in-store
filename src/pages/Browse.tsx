import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Search, Filter, Clock, Store, Heart, 
  ChevronDown, X, Zap, ShoppingBag, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  distance: string;
  deliveryTime: string;
  sizes: string[];
  category: string;
  inStock: boolean;
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Slim Fit Oxford Shirt",
    brand: "Zara",
    price: 2990,
    originalPrice: 3990,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    store: "Zara",
    distance: "0.8 km",
    deliveryTime: "12 min",
    sizes: ["S", "M", "L", "XL"],
    category: "Shirts",
    inStock: true,
  },
  {
    id: 2,
    name: "High Rise Skinny Jeans",
    brand: "H&M",
    price: 1999,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    store: "H&M",
    distance: "1.2 km",
    deliveryTime: "15 min",
    sizes: ["28", "30", "32", "34"],
    category: "Jeans",
    inStock: true,
  },
  {
    id: 3,
    name: "Oversized Blazer",
    brand: "Mango",
    price: 5990,
    originalPrice: 7990,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    store: "Mango",
    distance: "1.5 km",
    deliveryTime: "18 min",
    sizes: ["S", "M", "L"],
    category: "Blazers",
    inStock: true,
  },
  {
    id: 4,
    name: "Cotton Crew Neck Tee",
    brand: "Uniqlo",
    price: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    store: "Uniqlo",
    distance: "0.5 km",
    deliveryTime: "8 min",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "T-Shirts",
    inStock: true,
  },
  {
    id: 5,
    name: "Pleated Midi Skirt",
    brand: "Zara",
    price: 3490,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj09?w=400&h=500&fit=crop",
    store: "Zara",
    distance: "0.8 km",
    deliveryTime: "12 min",
    sizes: ["XS", "S", "M", "L"],
    category: "Skirts",
    inStock: true,
  },
  {
    id: 6,
    name: "Leather Biker Jacket",
    brand: "AllSaints",
    price: 12990,
    originalPrice: 18990,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    store: "AllSaints",
    distance: "2.1 km",
    deliveryTime: "22 min",
    sizes: ["S", "M", "L"],
    category: "Jackets",
    inStock: true,
  },
  {
    id: 7,
    name: "Linen Summer Dress",
    brand: "Mango",
    price: 4490,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    store: "Mango",
    distance: "1.5 km",
    deliveryTime: "18 min",
    sizes: ["XS", "S", "M", "L"],
    category: "Dresses",
    inStock: true,
  },
  {
    id: 8,
    name: "Relaxed Fit Chinos",
    brand: "H&M",
    price: 1799,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    store: "H&M",
    distance: "1.2 km",
    deliveryTime: "15 min",
    sizes: ["30", "32", "34", "36"],
    category: "Trousers",
    inStock: true,
  },
];

const categories = ["All", "Shirts", "T-Shirts", "Jeans", "Trousers", "Dresses", "Skirts", "Blazers", "Jackets"];
const stores = ["All Stores", "Zara", "H&M", "Mango", "Uniqlo", "AllSaints"];

const Browse = () => {
  const [location, setLocation] = useState<string>("Detecting location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Simulate location detection
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const area = data.address?.suburb || data.address?.neighbourhood || data.address?.city || "Your Location";
            setLocation(area);
          } catch {
            setLocation("Your Location");
          }
        },
        () => {
          setLocation("Enable location access");
        }
      );
    } else {
      setLocation("Location not available");
    }
  }, []);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesStore = selectedStore === "All Stores" || product.store === selectedStore;
    return matchesSearch && matchesCategory && matchesStore;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center rounded-lg">
                <Zap className="w-4 h-4 text-secondary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">ZipIn</span>
            </Link>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for clothes, brands..."
                  className="pl-10 pr-4 py-2 w-full bg-muted border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </div>

          {/* Location Bar */}
          <div className="flex items-center gap-2 mt-3 text-sm">
            <MapPin className="w-4 h-4 text-secondary" />
            <span className="text-muted-foreground">Delivering to</span>
            <button className="font-medium text-foreground flex items-center gap-1 hover:text-secondary transition-colors">
              {location}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 shrink-0 ml-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Store Filter */}
        {showFilters && (
          <div className="mb-6 p-4 bg-muted rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Filter by Store</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {stores.map((store) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStore === store
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-background text-foreground hover:bg-background/80"
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredProducts.length} items available near you
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favorites.includes(product.id) 
                        ? "fill-destructive text-destructive" 
                        : "text-foreground"
                    }`} 
                  />
                </button>

                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Quick Delivery Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-medium text-foreground">{product.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product.distance}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-2">
                  {product.sizes.slice(0, 4).map((size) => (
                    <span key={size} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {size}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{product.sizes.length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
