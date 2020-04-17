const fastcsv = require('fast-csv')
const fs = require('fs')
const exec = require('child_process').exec

// const area = 'Northland'
const area = 'Auckland'

const command = `curl 'https://api.trademe.co.nz/v1/search/property/rental.json?bedrooms_min=2&bedrooms_max=3&property_type=house&rows=240&return_canonical=true&return_metadata=true&return_ads=true&return_empty_categories=true&return_super_features=true&return_did_you_mean=true&canonical_path=%2Fproperty%2Fresidential%2Frent%2F${area}&rsqid=474a60d426864418b79be45e14978895-001' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Accept: application/json, text/plain, */*' -H 'Sec-Fetch-Dest: empty' -H 'x-trademe-uniqueclientid: caf2c577-fa60-5933-c976-0e2dbacacf51' -H 'User-Agent: Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36' -H 'newrelic: eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjQzODYzOCIsImFwIjoiMzgwMDc2Nzg0IiwiaWQiOiIyYjc3ZWJhNmM2ZTdkNzAyIiwidHIiOiI2NzE4MGNjZDliMTU5MTFhIiwidGkiOjE1ODY3NzI2MTM2NTR9fQ==' -H 'Origin: https://www.trademe.co.nz' -H 'Sec-Fetch-Site: same-site' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.trademe.co.nz/a/property/residential/rent/northland/search?bedrooms_min=2&bedrooms_max=3&property_type=house' -H 'Accept-Language: en-GB,enq=0.9,en-USq=0.8,ltq=0.7' --compressed --fail --silent --show-error`

exec(command, {maxBuffer: 1024 * 5000}, function (error, stdout, stderr) {
    if (error || stderr) {
        console.log('exec error: ' + stderr || error)
    } else if(stdout) {
        const now = new Date().toISOString()
        fs.writeFileSync(`rents-${area}-${now}.json`, stdout)
        const rents = JSON.parse(stdout)
        const _rents = rents.List.map(i=>{
            return {
                ListingId : i.ListingId,
                Title: i.Title,
                Suburb: i.Suburb,
                Bathrooms: i.Bathrooms,
                Bedrooms: i.Bedrooms,
                RentPerWeek: i.RentPerWeek,
                Whiteware: i.Whiteware
            }
        })
        const ws = fs.createWriteStream(`rents-${area}-${now}.csv`)
        fastcsv
            .write(_rents, { headers: true, quote: true, quoteColumns: true })
            .pipe(ws)
    }
})