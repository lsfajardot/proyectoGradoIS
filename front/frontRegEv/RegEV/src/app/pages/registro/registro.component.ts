import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { Type } from 'src/app/enum/status.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { Server } from 'src/app/interface/server';
import { NotificationService } from 'src/app/service/notification.service';
import { ServerService } from 'src/app/service/server.service';
import {} from 'googlemaps';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit, AfterViewInit {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  appState$: Observable<AppState<CustomResponse>>;
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  readonly Status = Type;
  @ViewChild('mapa', { static: true }) mapElement: any;
  @ViewChild('serverForm') serverForm: NgForm;
  map: google.maps.Map;

  constructor(
    private serverService: ServerService,
    private notifier: NotificationService,
    private http: HttpClient
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.initialiceMap();
  }

  initialiceMap() {
    let marker: any;
    let myLatlng = new google.maps.LatLng(4.6286963, -74.0660545);
    let geocoder = new google.maps.Geocoder();
    let infowindow = new google.maps.InfoWindow();
    const mapProperties = {
      center: myLatlng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    marker = new google.maps.Marker({
      map: this.map,
      position: myLatlng,
      draggable: true,
    });

    geocoder.geocode({ location: myLatlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log(results[0]);
          this.setValueForm(results[0], marker);
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(this.map, marker);
        }
      }
    });
    google.maps.event.addListener(marker, 'dragend', () => {
      geocoder.geocode(
        { location: marker.getPosition() },
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              //console.log(results[0])
              this.setValueForm(results[0], marker);
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(this.map, marker);
            }
          }
        }
      );
    });
    //google.maps.event.addDomListener(window, 'load', initialize);
  }

  setValueForm(dataMap, marker) {
    //console.log(this.serverForm)
    this.serverForm.controls['direccion'].setValue(dataMap.formatted_address);
    this.serverForm.controls['latitud'].setValue(marker.getPosition().lat());
    this.serverForm.controls['longitud'].setValue(marker.getPosition().lng());
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    console.log(serverForm.value);
    console.log(serverForm);
    this.serverService
      .save$({
        id: null,
        direccion: serverForm.controls['direccion'].value,
        latitud: serverForm.controls['latitud'].value,
        longitud: serverForm.controls['longitud'].value,
        tipo: serverForm.controls['tipo'].value,
        fecha: null
      })
      .subscribe((resp) => {
        this.notifier.onDefault(resp.message);
        this.isLoading.next(false);
        serverForm.resetForm({ status: this.Status.FLETEO });
      });
    /* .pipe(
      map((response) => {
        console.log(response)
        this.dataSubject.next(
          {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] } }
        );
        this.notifier.onDefault(response.message);
        //this.isLoading.next(false);
        serverForm.resetForm({ status: this.Status.FLETEO });
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE,  appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    ); */
  }

  save(server: Server) {
    return this.http
      .post<CustomResponse>(`http://localhost:8080/server/save`, server)
      .pipe(tap(console.log));
  }
}
