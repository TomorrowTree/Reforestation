const Polygon = (polygon) => {
  const coordinates = polygon.getPaths().getArray()[0].getArray()
  let coords = ""

  for (let step = 0; step < coordinates.length; step++) {
    const latLng = coordinates[step].toJSON()
    const lat = latLng.lat
    const lng = latLng.lng
    // coords = [lat, lng, ...coords]
    coords = coords + lat + "," + lng + "|"
  }
  coords =
    coords + coordinates[0].toJSON().lat + "," + coordinates[0].toJSON().lng
  return coords
}

export default Polygon
