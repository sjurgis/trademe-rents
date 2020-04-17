const fs = require('fs')
const list = fs.readdirSync('.').filter(i => i.startsWith('rents-') && i.endsWith('.json'))
// console.log(list)

const rates = list.map(i => {
    const id = i.split('-')
    const groups = new RegExp('(?<=2020-)(.*)(?=.json)').exec(i)
    const date = '2020-' + groups[1]
    return {
        region: id[1],
        date: new Date(date),
        listings: JSON.parse(fs.readFileSync(i)).List
    }
}).sort((a, b) => b.date - a.date)
// console.log(rates)
const auckland = rates.filter(i=>i.region === 'Auckland')
const matchingListings = auckland[0].listings.filter(i => auckland[1].listings.find(j => j.ListingId === i.ListingId && j.RentPerWeek !== i.RentPerWeek) )
    .map( current => {
        const previous = auckland[1].listings.find(j => j.ListingId === current.ListingId)
        return {
            ListingId : current.ListingId,
            delta: current.RentPerWeek - previous.RentPerWeek
        }
    })
console.log(matchingListings)