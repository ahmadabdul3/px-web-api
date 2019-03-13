import http from 'src/services/http';

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export function getAddressInfo({ address }) {
  let locationId;
  let locationCoordinates;

  return getPlaceId(address).then(response => {
    const placeNotFoundError = { message: 'place not found from google places api' };
    console.log('address ******', address);
    console.log('response from google places', response);
    const { candidates } = response;
    if (!candidates || candidates.length < 1) throw placeNotFoundError;

    locationId = candidates[0].place_id;
    locationCoordinates = candidates[0].geometry.location;
    return  {};
  }).then(response => {
    return getPlaceDetails(locationId);
  }).then(resp => {
    const result = resp && resp.result;
    const addressComponents = result.address_components || {};
    const { city, state, streetNumber, streetName } = getPartsFromAddress({ addressComponents });
    return { locationId, city, state, streetNumber, streetName, locationCoordinates };
  });
}

function getPartsFromAddress({ addressComponents }) {
  const cityKey = 'locality';
  const stateKey = 'administrative_area_level_1';
  const streetNumberKey = 'street_number';
  const streetNameKey = 'route';

  return addressComponents.reduce((all, c) => {
    if (c.types.includes(cityKey)) all.city = c.long_name;
    else if (c.types.includes(stateKey)) all.state = c.long_name;
    else if (c.types.includes(streetNumberKey)) all.streetNumber = c.long_name;
    else if (c.types.includes(streetNameKey)) all.streetName = c.long_name;
    return all;
  }, {});
}

function getPlaceId(address) {
  const urlStart = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?';
  const input = `input=${address}`
  const urlEnd = `&inputtype=textquery&fields=place_id,geometry&key=${apiKey}`;
  const url = `${urlStart}${input}${urlEnd}`;

  return http.get(url)
    .then(res => res)
    .catch(err => {
      console.log('error', err);
      return err;
    });
}

function getPlaceDetails(placeId) {
  const urlStart = 'https://maps.googleapis.com/maps/api/place/details/json?';
  const place = `placeid=${placeId}`
  const urlEnd = `&fields=address_components,name,rating,formatted_phone_number&key=${apiKey}`;
  const url = `${urlStart}${place}${urlEnd}`;

  return http.get(url)
    .then(res => res)
    .catch(err => {
      console.log(err);
      return err;
    });
}
