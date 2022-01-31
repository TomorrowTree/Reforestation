import React, { useState, useCallback } from "react"
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
} from "@react-google-maps/api"
import Polygon from "./Polygon"
import { useMoralisFile } from "react-moralis"
import "./App.css"

/* global google */

// docs: https://react-google-maps-api-docs.netlify.app

const containerStyle = {
  width: "600px",
  height: "400px",
}

const addons = ["drawing", "geometry"]

const mapStyle = "hybrid"

const imageUrl = "https://maps.googleapis.com/maps/api/staticmap?"

const center = {
  lat: 41.30186132431379,
  lng: -124.04761895135475,
}

const Googlemap = (props) => {
  const [map, setMap] = useState(null)
  const { saveFile } = useMoralisFile()

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: addons,
  })

  const onLoad = useCallback((map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback((map) => {
    setMap(null)
  }, [])

  const drawLoad = (drawingManager) => {
    // console.log(drawingManager)
  }

  const onSubmitFile = async (imageBlob) => {
    const file = imageBlob
    let fileIpfs = await saveFile("map.png", file, { saveIPFS: true })
    props.setMapImage(fileIpfs.toJSON().url)
  }

  // const path =
  //   "&path=color:0x0000ff|weight:5|41.31243513404983,-124.01380166009498|41.313595569711104,-124.03611763909889|41.320170981596355,-124.02564629510475|41.31243513404983,-124.01380166009498"
  // const location = "center=40.714728,-73.998672&zoom=12"
  const completePolygon = (polygon) => {
    const polygonCoordinates = Polygon(polygon)
    const polygonArea = google.maps.geometry.spherical.computeArea(
      polygon.getPath()
    )
    props.setArea(polygonArea)

    const url = `${imageUrl}size=600x400&format=png&maptype=hybrid&path=color:0x0000ff|weight:5|${polygonCoordinates}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    fetch(url)
      .then((response) => response.blob())
      .then((imageBlob) => {
        onSubmitFile(imageBlob)
      })
  }

  return isLoaded ? (
    <div className="mapContainer">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapTypeId={mapStyle}
        tilt={0}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <DrawingManager
          drawingMode="polygon"
          onLoad={drawLoad}
          onPolygonComplete={completePolygon}
        />
        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default Googlemap
