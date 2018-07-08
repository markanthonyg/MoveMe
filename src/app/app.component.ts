import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as leaflet from 'leaflet';
import * as _ from 'lodash';
import {FormControl} from '@angular/forms';
import {Observable}  from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
// import * as google from 'google';
// import * as gMaps from 'google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  map: any;
  modelChanged: Subject<string> = new Subject<string>();
  cityInput = '';
  googleApiKey: string = 'AIzaSyDIIfYxrJOeNnaMGdIXSrvFlIFemyl81Ww';

  constructor(private http: HttpClient) {
    this.modelChanged
      .debounceTime(700) // wait 300ms after the last event before emitting last event
      //.distinctUntilChanged() // only emit if value is different from previous value
      .subscribe(cityInput => {
        this.cityInput = cityInput;
        this.getCityCoordinates();
    });
  }

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
    //this.getCityCoordinates();
  }

  changed(text) {
    console.log(text);
    this.modelChanged.next(text);
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
      let zoom = loc_type == 'locality' ? 9 : loc_type == 'postal_code' ? 13 : 16;
      this.map.setView([result.results[0].geometry.location.lat, result.results[0].geometry.location.lng], zoom);
      let radius = this.calculateRadius(result);
      this.clearLayers();
      let circle = leaflet.circle([result.results[0].geometry.location.lat, result.results[0].geometry.location.lng], {
          color: '#6BB9F0',
          fillColor: '#6BB9F0',
          fillOpacity: 0.25,
          radius: radius
      }).addTo(this.map);
    });
  }

  calculateRadius(res) {
    var R = 6371e3; // metres
    var l1 = res.results[0].geometry.bounds.northeast.lat * (Math.PI / 180);
    var l2 = res.results[0].geometry.bounds.southwest.lat * (Math.PI / 180);
    var d1 = (res.results[0].geometry.bounds.southwest.lat-res.results[0].geometry.bounds.northeast.lat) * (Math.PI / 180);
    var d2 = (res.results[0].geometry.bounds.southwest.lng-res.results[0].geometry.bounds.northeast.lng) * (Math.PI / 180);

    var a = Math.sin(d1/2) * Math.sin(d1/2) +
            Math.cos(l1) * Math.cos(l2) *
            Math.sin(d2/2) * Math.sin(d2/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    console.log(d);
    return d / 2;
  }

  clearLayers() {
    for(var i in this.map._layers) {
        if(this.map._layers[i]._path != undefined) {
            try {
                this.map.removeLayer(this.map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + this.map._layers[i]);
            }
        }
    }
  }
}
