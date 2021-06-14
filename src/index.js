const axios = require('axios')
const cheerio = require('cheerio');

const url = 'https://www.wwoz.org/calendar/livewire-music'
const config = {
  headers: {'Access-Control-Allow-Origin': '*'}
}

const btn = () => document.getElementById('btn')
const live_re_wire = document.getElementsByClassName('live-re-wire')

btn.addEventListener('click', getArtistEvents())


function getArtistEvents() {
  axios(url, config)
  .then(response =>{
    const html = response.data;
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
    const div = document.createElement('div')
    const p = document.createElement('p')
    p.innerText = `${this.artist_name} ${this.event_href}`
    div.appendChild(p)
  }
}
