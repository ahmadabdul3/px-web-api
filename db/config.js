// - this import is needed for the config to
//   correctly see the env variables
const dotenv = require('dotenv').config();

const shared = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    underscored: false
  },
};

module.exports = {
  development: shared,
  production: shared,
  test: shared,
};

// {
//    "results" : [
//       {
//          "address_components" : [
//             {
//                "long_name" : "06510",
//                "short_name" : "06510",
//                "types" : [ "postal_code" ]
//             },
//             {
//                "long_name" : "New Haven",
//                "short_name" : "New Haven",
//                "types" : [ "locality", "political" ]
//             },
//             {
//                "long_name" : "New Haven County",
//                "short_name" : "New Haven County",
//                "types" : [ "administrative_area_level_2", "political" ]
//             },
//             {
//                "long_name" : "Connecticut",
//                "short_name" : "CT",
//                "types" : [ "administrative_area_level_1", "political" ]
//             },
//             {
//                "long_name" : "United States",
//                "short_name" : "US",
//                "types" : [ "country", "political" ]
//             }
//          ],
//          "formatted_address" : "New Haven, CT 06510, USA",
//          "geometry" : {
//             "bounds" : {
//                "northeast" : {
//                   "lat" : 41.314352,
//                   "lng" : -72.91843899999999
//                },
//                "southwest" : {
//                   "lat" : 41.301114,
//                   "lng" : -72.9480619
//                }
//             },
//             "location" : {
//                "lat" : 41.3052226,
//                "lng" : -72.92686259999999
//             },
//             "location_type" : "APPROXIMATE",
//             "viewport" : {
//                "northeast" : {
//                   "lat" : 41.314352,
//                   "lng" : -72.91843899999999
//                },
//                "southwest" : {
//                   "lat" : 41.301114,
//                   "lng" : -72.939227
//                }
//             }
//          },
//          "place_id" : "ChIJk_gtEdLZ54kR0jFQrUQ1S80",
//          "types" : [ "postal_code" ]
//       }
//    ],
//    "status" : "OK"
// }
