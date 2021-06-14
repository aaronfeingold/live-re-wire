const cheerio = require('cheerio');
const puppeteer = require('puppeteer')

const url = 'https://www.wwoz.org/calendar/livewire-music'
const config = {
  headers: {'Access-Control-Allow-Origin': '*'}
}

callOnLoad()

function callOnLoad() {
  getArtistEvents()
}

function getArtistEvents() {
 puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(async page => {
    await page.goto(url, config);
    return await page.content();
  })
  .then(html =>{
    const $ = cheerio.load(html);
    const links = $('a');
    const artist_events = {}
    $(links).each(function(i, link){
      let event_href = $(link).attr('href')
      if (event_href != undefined && event_href.includes("events") == true){
          let artist_event = {}
          let artist_name = $(link).text().replace(/\s+/g, '')
          artist_event["artist_name"] = artist_name
          artist_event["event_href"] = event_href
          artist_events[i] = artist_event
        }
    });
        console.log(artist_events);
      debugger;
      ArtistEvent.createArtistEvents(artist_events);
      ArtistEvent.displayArtistEvents();
    })
    .catch(console.error)
}

class ArtistEvent {
  static all = []

  constructor(artist_name, event_href){
    this.artist_name = artist_name;
    this.event_href = event_href;
  }

  static createArtistEvents(artistEventsObject){
    let keys = Object.keys(artistEventsObject)
    keys.forEach(key => {
      let artist_event_obj = artistEventsObject[key]
      ArtistEvent.create(artist_event_obj)
    })
  }

  static create(data) {
    let artist_event = new ArtistEvent(data["artist_name"], data["event_href"])
    ArtistEvent.all.push(artist_event)

    return artist_event
  }

  static displayArtistEvents(){
    ArtistEvent.all.forEach(artist_event => artist_event.display())
  }

  display() {
    let p = `${this.artist_name} ${this.event_href}`
    console.log(p)
  }

}
