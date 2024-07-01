import parse from 'csv-parser'
// const csv = require('csv-parser')
import fs from 'fs'
import { ExoplanetData } from './interface/interface'

// parse()

const habitablePlanets: ExoplanetData[] = []

// Filter the only planets that are habitable
// base on the study, koi_insol(amount of lights the planet can get from its sun) between 0.36 to 1.11 is most likely habitable
// koi_prad needs to be less than 1.6
function isHabitablePlanet(planet: ExoplanetData) {
  return (
    planet.koi_disposition === 'CONFIRMED' &&
    parseFloat(planet.koi_insol) > 0.36 &&
    parseFloat(planet.koi_insol) < 1.11 &&
    parseFloat(planet.koi_prad) < 1.6
  )
}
// Open a file as a readable stream
// fs.createReadStream() is an event emitter
// We can read a file in piece by piece
fs.createReadStream('./src/data/kepler_Cumulative_list.csv')
  // pipe() connects two streams together, here it connects a readable stream source to a writable string destination: readable.pipe(writable)
  .pipe(
    parse({
      skipComments: true,
    })
  )
  .on('data', (chunk: ExoplanetData) => {
    // is the chunk a single item in the array?
    if (isHabitablePlanet(chunk)) {
      habitablePlanets.push(chunk)
    }
  })
  .on('error', (err) => {
    console.log('Process csv file failed: ', err)
  })
  .on('end', () => {
    console.log(
      habitablePlanets.map((habitablePlanet) => {
        return habitablePlanet.kepler_name
      })
    )

    console.log(habitablePlanets)
    console.log('Total habitable planets are: ', habitablePlanets.length)
    console.log('Done processing the csv file.')
  })
