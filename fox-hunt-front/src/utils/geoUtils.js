export function generateGeodesicCircle(center, radiusMeters, points = 64) {
  const [lng, lat] = center;
  const R = 6371000; 
  const coords = [];

  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;

    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);

    const newLat = lat + (dy / R) * (180 / Math.PI);
    const newLng =
      lng +
      (dx / (R * Math.cos((lat * Math.PI) / 180))) *
        (180 / Math.PI);

    coords.push([newLng, newLat]);
  }
  coords.push(coords[0]);
  return coords;
}
