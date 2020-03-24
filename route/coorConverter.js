
var express = require('express');
var api = express.Router();

const toRadians = function(degree){
	return degree * (Math.PI / 180)
}

api.post('/gps2utm', function(req, res){
  console.log("A")
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  console.log("A")
  if (isNaN(lat) || isNaN(lon)) return res.json({error:"Invalid point"})
  console.log("A")
  if (!(-80 <= lat && lat <= 84)) return res.json({error:"Outside UTM limits"})

  console.log("A")
  var falseEasting = 500e3,
    falseNorthing = 10000e3;
  var zone = Math.floor((lon + 180) / 6) + 1; // longitudinal zone
  var λ0 = toRadians((zone - 1) * 6 - 180 + 3); // longitude of central meridian
  var φ = toRadians(lat); // latitude ± from equator
  var λ = toRadians(lon) - λ0; // longitude ± from central meridian
  //var a = this.datum.ellipsoid.a, f = this.datum.ellipsoid.f;
  const a = 6378137,
    b = 6356752.314245,
    f = 1 / 298.257223563;

  var k0 = 0.9996; // UTM scale on the central meridian

	console.log("A")
  // ---- easting, northing: Karney 2011 Eq 7-14, 29, 35:

  var e = Math.sqrt(f * (2 - f)); // eccentricity
  var n = f / (2 - f); // 3rd flattening
  var n2 = n * n,
    n3 = n * n2,
    n4 = n * n3,
    n5 = n * n4,
    n6 = n * n5; // TODO: compare Horner-form accuracy?

  var cosλ = Math.cos(λ),
    sinλ = Math.sin(λ)
  var τ = Math.tan(φ); // τ ≡ tanφ, τʹ ≡ tanφʹ; prime (ʹ) indicates angles on the conformal sphere
  var σ = Math.sinh(e * Math.atanh(e * τ / Math.sqrt(1 + τ * τ)));

  var τʹ = τ * Math.sqrt(1 + σ * σ) - σ * Math.sqrt(1 + τ * τ);

  var ξʹ = Math.atan2(τʹ, cosλ);
  var ηʹ = Math.asinh(sinλ / Math.sqrt(τʹ * τʹ + cosλ * cosλ));

  var A = a / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6); // 2πA is the circumference of a meridian

  var α = [
    null, // note α is one-based array (6th order Krüger expressions)
    1 / 2 * n - 2 / 3 * n2 +5 / 16 * n3 + 41 / 180 * n4 -127 / 288 * n5 + 7891 / 37800 * n6,
    13 / 48 * n2 - 3 / 5 * n3 +557 / 1440 * n4 + 281 / 630 * n5 -1983433 / 1935360 * n6,
    61 / 240 * n3 - 103 / 140 * n4 + 15061 / 26880 * n5 + 167603 / 181440 * n6,
    49561 / 161280 * n4 - 179 / 168 * n5 + 6601661 / 7257600 * n6,
    34729 / 80640 * n5 - 3418889 / 1995840 * n6,
    212378941 / 319334400 * n6
  ];
  var ξ = ξʹ;
  for (var j = 1; j <= 6; j++)
    ξ += α[j] * Math.sin(2 * j * ξʹ) * Math.cosh(2 * j * ηʹ);
  var η = ηʹ;
  for (var j = 1; j <= 6; j++)
    η += α[j] * Math.cos(2 * j * ξʹ) * Math.sinh(2 * j * ηʹ);
  var x = k0 * A * η;
  var y = k0 * A * ξ;

  // shift x/y to false origins
  x = x + falseEasting; // make x relative to false easting
  if (y < 0) y = y + falseNorthing; // make y in southern hemisphere relative to

  console.log("x = " + x + "\n");
  console.log("y = " + y + "\n");
  //return new Utm(zone, h, x, y, this.datum, convergence, scale);
  res.json({x: x, y: y})
})

module.exports = api;