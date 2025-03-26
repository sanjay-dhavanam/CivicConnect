declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBgQF7V2-5UEn4AwXsTb5mjRipKbjhpfZ8"; // Default key should be replaced with actual key from environment variables

// Load Google Maps API
export function getGoogleMaps(): Promise<any> {
  // If Google Maps is already loaded, return it
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  // Otherwise, load the API
  return new Promise((resolve, reject) => {
    // Check if the script was already loaded
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps script failed to load'));
      }
      return;
    }

    // Define callback for when API is loaded
    window.initMap = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps failed to initialize'));
      }
    };

    // Load the script
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
  });
}
