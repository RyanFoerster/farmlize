/**
 * Recolore le style vectoriel « positron » d'OpenFreeMap aux couleurs Farmlize :
 * fond crème, forêts vert tendre, eau sauge, routes blanches, libellés en français.
 */
const C = {
  land: '#F1ECDF',
  urban: '#EAE3D2',
  building: '#E1D8C3',
  meadow: '#DCE6C8',
  forest: '#C5D9B0',
  water: '#C9D7F1',
  waterLine: '#AFC3EA',
  road: '#FFFDF8',
  roadMajor: '#FFFBF1',
  casing: '#E2D9C6',
  rail: '#D6CCB6',
  boundary: '#B6A890',
  text: '#5E544B',
  textStrong: '#352200',
  halo: '#FCFAF2',
};

const frName = ['coalesce', ['get', 'name:fr'], ['get', 'name:latin'], ['get', 'name']];

export async function farmlizeStyle(url = 'https://tiles.openfreemap.org/styles/positron') {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`style ${res.status}`);
  const style = await res.json();

  for (const l of style.layers as any[]) {
    const id: string = l.id ?? '';
    const sl: string = l['source-layer'] ?? '';
    l.paint ??= {};
    l.layout ??= {};

    if (l.type === 'background') {
      l.paint['background-color'] = C.land;
      continue;
    }
    if (l.type === 'fill') {
      delete l.paint['fill-pattern'];
      if (sl === 'water' || /water/.test(id)) {
        l.paint['fill-color'] = C.water;
        l.paint['fill-opacity'] = 1;
      } else if (/wood|forest/.test(id)) {
        l.paint['fill-color'] = C.forest;
        l.paint['fill-opacity'] = 0.95;
      } else if (sl === 'park' || /park|grass|meadow|scrub|landcover/.test(id)) {
        l.paint['fill-color'] = /ice|glacier/.test(id) ? '#F6F4EE' : C.meadow;
        l.paint['fill-opacity'] = 0.9;
      } else if (sl === 'building' || /building/.test(id)) {
        l.paint['fill-color'] = C.building;
        l.paint['fill-outline-color'] = '#DAD0BB';
        l.paint['fill-opacity'] = 0.9;
      } else if (sl === 'landuse' || sl === 'aeroway' || /landuse|residential|aeroway/.test(id)) {
        l.paint['fill-color'] = C.urban;
        l.paint['fill-opacity'] = 0.8;
      }
      continue;
    }
    if (l.type === 'fill-extrusion') {
      l.paint['fill-extrusion-color'] = C.building;
      continue;
    }
    if (l.type === 'line') {
      if (sl === 'waterway' || /water|river|stream|canal/.test(id)) l.paint['line-color'] = C.waterLine;
      else if (sl === 'boundary' || /boundary|admin/.test(id)) {
        l.paint['line-color'] = C.boundary;
        l.paint['line-opacity'] = 0.7;
      } else if (/rail/.test(id)) l.paint['line-color'] = C.rail;
      else if (/casing/.test(id)) l.paint['line-color'] = C.casing;
      else if (sl === 'transportation' || /highway|road|street|path|motorway|bridge|tunnel|aeroway/.test(id))
        l.paint['line-color'] = /motorway|major|trunk|primary/.test(id) ? C.roadMajor : C.road;
      continue;
    }
    if (l.type === 'symbol') {
      if (sl === 'poi' || sl === 'housenumber' || sl === 'aerodrome_label' || sl === 'mountain_peak') {
        l.layout.visibility = 'none';
        continue;
      }
      if (l.layout['text-field']) {
        if (sl === 'place' || sl === 'water_name' || /place|water_name/.test(id)) l.layout['text-field'] = frName;
        l.paint['text-color'] = sl === 'place' && /city|capital|town/.test(id) ? C.textStrong : C.text;
        if (sl === 'water_name') l.paint['text-color'] = '#4E6FB8';
        l.paint['text-halo-color'] = C.halo;
        l.paint['text-halo-width'] = 1.4;
      }
    }
  }
  return style;
}

/** Polygone circulaire (rayon en km) pour la zone de recherche. */
export function circle(lng: number, lat: number, km: number, steps = 96) {
  const coords: [number, number][] = [];
  const dLat = km / 110.574;
  const dLng = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    coords.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return {
    type: 'FeatureCollection' as const,
    features: [{ type: 'Feature' as const, properties: {}, geometry: { type: 'Polygon' as const, coordinates: [coords] } }],
  };
}
