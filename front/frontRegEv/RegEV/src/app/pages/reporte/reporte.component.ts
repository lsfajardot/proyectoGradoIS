import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { Type } from 'src/app/enum/status.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { Server } from 'src/app/interface/server';
import { NotificationService } from 'src/app/service/notification.service';
import { ServerService } from 'src/app/service/server.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Type = Type;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();


  constructor(private serverService: ServerService, private notifier: NotificationService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        this.notifier.onDefault(response.message);
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: { ...response, data: { servers: response.data.servers.reverse() } } }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  /* pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map((response) => {
        const index = this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server.id);
        this.dataSubject.value.data.servers[index] = response.data.server;
        this.notifier.onDefault(response.message);
        this.filterSubject.next('');
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.filterSubject.next('');
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  } */

  /* saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
    .pipe(
      map((response) => {
        this.dataSubject.next(
          {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] } }
        );
        this.notifier.onDefault(response.message);
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        serverForm.resetForm({ status: this.Type.FLETEO });
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE,  appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  } */

  filterServers(status: Type): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map((response) => {
          this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error: error });
        })
      );
  }

  /* deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map((response) => {
        this.dataSubject.next(
          { ...response, data:
            { servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)} }
        );
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value};
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.notifier.onError(error);
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  } */

  printReport(): void {
    this.notifier.onDefault('Report Downloaded');
    //window.print();
    let dataType = 'application/vnd.ms-excel.sheet.macroEnable.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'reporte_eventos.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
