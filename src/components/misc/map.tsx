import { GoogleMap, Marker, useGoogleMap, useLoadScript } from "@react-google-maps/api";
import { Loading } from "mdi-material-ui";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "src/config";
import MapMarkerIcon from 'mdi-material-ui/MapMarker';

interface IProps {
    position: google.maps.LatLngLiteral,
    onCoordsChange: (coords: google.maps.LatLngLiteral) => void
}

const Map = (props: IProps) => {
    // ** Props
    const { position, onCoordsChange } = props;
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: config.googleMapsApiKey
    });

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    if (!isLoaded) return <Loading></Loading>;

    const onCenterChanged = () => {
        if (map) {
            const coords: google.maps.LatLngLiteral = {
                lat: map!.getCenter()!.lat(),
                lng: map!.getCenter()!.lng()
            };
            onCoordsChange(coords);
        }
    }

    return <GoogleMap
        zoom={15}
        center={position}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onLoad}
        onCenterChanged={onCenterChanged}
    >
        <MapMarkerIcon sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -95%)', fontWeight: 900, fontSize: 50 }}></MapMarkerIcon>
    </GoogleMap>;
};

export default Map;