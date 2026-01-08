import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import { useEffect, useRef, useState } from "react";
const App = () => {
  const [watchID, setWatchID] = useState();
  const [location, setLocation] = useState({});
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  // References
  const MapBox_Access_Token = useRef(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);

  useEffect(() => {
    const watch = window.navigator.geolocation.watchPosition(
      (position) => {
        setWatchID(watch);
        const { longitude, latitude } = position.coords;
        setLocation({ longitude, latitude });
        setIsLocationEnabled(true);
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    return () => {
      if (watchID) {
        navigator.geolocation.clearWatch(watchID);
      }
    };
  }, []);

  useEffect(() => {
    if (isLocationEnabled && location.latitude) {
      mapboxgl.accessToken = MapBox_Access_Token.current;
      const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/standard-satellite", // style URL
        center: [location.longitude, location.latitude], // starting position [lng, lat]
        zoom: 16, // starting zoom
      });
      console.log(location);
      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
    }
  }, [isLocationEnabled]);

  return (
    <div className="flex flex-col gap-10 items-center justify-center">
      <h1 className="text-4xl font-bold text-center mt-10">
        Let's try MapBox GL JS
      </h1>
      <div
        className="border"
        id="map"
        style={{ width: "500px", height: "500px" }}
      ></div>
    </div>
  );
};

export default App;
