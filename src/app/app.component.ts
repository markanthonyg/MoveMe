import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as leaflet from 'leaflet';
import * as _ from 'lodash';
// import * as google from 'google';
// import * as gMaps from 'google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  map: any;
  map

  constructor(private http: HttpClient) { }

  cityInput = 'Phoenix';
  googleApiKey: string = 'AIzaSyDIIfYxrJOeNnaMGdIXSrvFlIFemyl81Ww';

  ngOnInit() {
    this.map = leaflet.map('map').setView([51.505, -0.09], 13);
    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFya2FudGhvbnlnIiwiYSI6ImNqamF3bjVhMjBhazczcG80aTFwb2Y5ejEifQ.fe92dWukoxySW3KC7yC_-w', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFya2FudGhvbnlnIiwiYSI6ImNqamF3bjVhMjBhazczcG80aTFwb2Y5ejEifQ.fe92dWukoxySW3KC7yC_-w'
    }).addTo(this.map);
    let marker = leaflet.marker([51.505, -0.09]).addTo(this.map);
    // let circle = leaflet.circle([51.508, -0.11], {
    //     color: 'red',
    //     fillColor: '#f03',
    //     fillOpacity: 0.5,
    //     radius: 500
    // }).addTo(this.map);
    console.log(this.cityInput.replace(/ /g, '+'))
    this.getCityCoordinates();
  }

  getCityCoordinates() {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.cityInput.replace(/ /g, '+') + '&key=AIzaSyDIIfYxrJOeNnaMGdIXSrvFlIFemyl81Ww';

    this.http.get(url).subscribe((result: any) => {
      console.log(result);
      let citySearch = '';
      if (result.results.length == 0)
        return;
      let city = _.find(result.results[0].address_components, function(e) { return e.types[0] == 'locality'});
      let zip = _.find(result.results[0].address_components, function(e) { return e.types[0] == 'postal_code' });
      if (city && zip)
        citySearch = city.long_name + ' ' + zip.long_name;
      console.log(citySearch);
      let loc_type = result.results[0].types[0].toLowerCase();
      let zoom = loc_type == 'locality' ? 10 : loc_type == 'postal_code' ? 13 : 16;
      this.map.setView([result.results[0].geometry.location.lat, result.results[0].geometry.location.lng], zoom);
      // let circle = leaflet.circle([result.results[0].geometry.location.lat, result.results[0].geometry.location.lng], {
      //     color: 'red',
      //     fillColor: '#f03',
      //     fillOpacity: 0.5,
      //     radius: 3000
      // }).addTo(this.map);
    });
  }
}
