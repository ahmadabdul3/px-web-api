import { ward1Arrays } from 'src/constants/ward_polygons/ward_1';
import { ward2Arrays } from 'src/constants/ward_polygons/ward_2';
import { ward3Arrays } from 'src/constants/ward_polygons/ward_3';
import { ward4Arrays } from 'src/constants/ward_polygons/ward_4';
import { ward5Arrays } from 'src/constants/ward_polygons/ward_5';
import { ward6Arrays } from 'src/constants/ward_polygons/ward_6';
import { ward7Arrays } from 'src/constants/ward_polygons/ward_7';
import { ward8Arrays } from 'src/constants/ward_polygons/ward_8';
import { ward9Arrays } from 'src/constants/ward_polygons/ward_9';
import { ward10Arrays } from 'src/constants/ward_polygons/ward_10';
import { ward11Arrays } from 'src/constants/ward_polygons/ward_11';
import { ward12Arrays } from 'src/constants/ward_polygons/ward_12';
import { ward13Arrays } from 'src/constants/ward_polygons/ward_13';
import { ward14Arrays } from 'src/constants/ward_polygons/ward_14';
import { ward15Arrays } from 'src/constants/ward_polygons/ward_15';
import { ward16Arrays } from 'src/constants/ward_polygons/ward_16';
import { ward17Arrays } from 'src/constants/ward_polygons/ward_17';
import { ward18Arrays } from 'src/constants/ward_polygons/ward_18';
import { ward19Arrays } from 'src/constants/ward_polygons/ward_19';
import { ward20Arrays } from 'src/constants/ward_polygons/ward_20';
import { ward21Arrays } from 'src/constants/ward_polygons/ward_21';
import { ward22Arrays } from 'src/constants/ward_polygons/ward_22';
import { ward23Arrays } from 'src/constants/ward_polygons/ward_23';
import { ward24Arrays } from 'src/constants/ward_polygons/ward_24';
import { ward25Arrays } from 'src/constants/ward_polygons/ward_25';
import { ward26Arrays } from 'src/constants/ward_polygons/ward_26';
import { ward27Arrays } from 'src/constants/ward_polygons/ward_27';
import { ward28Arrays } from 'src/constants/ward_polygons/ward_28';
import { ward29Arrays } from 'src/constants/ward_polygons/ward_29';
import { ward30Arrays } from 'src/constants/ward_polygons/ward_30';
import classifyPoint from 'robust-point-in-polygon';


export function determineWardNumberFromLocation({ location }) {
  const allWards = getAllWardPolygonArrays();

  for (let i = 0; i < allWards.length; i++) {
    const ward = allWards[i]();
    const res = classifyPoint(ward, location);
    if (res === -1) return { status: 'success', wardNumber: i + 1 };
  }

  return { status: 'fail', message: 'The ward for this location was not found' };
}

export function getAllWardsAsObj() {
  const allWards = getAllWardPolygonArrays();
  const allWardsAsObj = [];
  allWards.forEach(w => {
    // - polygonObj is [ {lat, lng}, {lat, lng} etc... ]
    const polygonObj = w().map(l => ({ lat: l[0], lng: l[1] }));
    allWardsAsObj.push(polygonObj);
  });

  console.log('[');
  allWardsAsObj.forEach(w => {
    console.log('  [');
    w.forEach(l => {
      console.log(`    { lat: ${l.lat}, lng: ${l.lng} },`);
    });
    console.log('  ],');
  });
  console.log('];')
}

function getAllWardPolygonArrays() {
  return [
    ward1Arrays,
    ward2Arrays,
    ward3Arrays,
    ward4Arrays,
    ward5Arrays,
    ward6Arrays,
    ward7Arrays,
    ward8Arrays,
    ward9Arrays,
    ward10Arrays,
    ward11Arrays,
    ward12Arrays,
    ward13Arrays,
    ward14Arrays,
    ward15Arrays,
    ward16Arrays,
    ward17Arrays,
    ward18Arrays,
    ward19Arrays,
    ward20Arrays,
    ward21Arrays,
    ward22Arrays,
    ward23Arrays,
    ward24Arrays,
    ward25Arrays,
    ward26Arrays,
    ward27Arrays,
    ward28Arrays,
    ward29Arrays,
    ward30Arrays,
  ];
}
