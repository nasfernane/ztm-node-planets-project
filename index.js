const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

const isHabitable = (planet) => {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 // insolation flux
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6; // planetory radius
};

fs.createReadStream('./kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true
  }))
  .on('data', (planet) => {
    if (isHabitable(planet)) habitablePlanets.push(planet);
  })
  .on('error', (err) => {
    console.log('error:', err);
  })
  .on('end', () => {
    console.log(`${habitablePlanets.length} habitable planets found !`)
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }))
  })

