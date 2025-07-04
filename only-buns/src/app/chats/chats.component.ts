import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LocationMessage } from '../model/location-message.model';
import { MapsService } from '../posts-on-map/maps.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [    CommonModule,
    MatCardModule,  
    MatButtonModule,
    MatIconModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements AfterViewInit{
  messages: LocationMessage[] = [];
  private map: any;
  private L: any;

  @ViewChild('mapContainer', { static: false })
  mapContainer!: ElementRef<HTMLElement>;

  
  constructor(private locationMessageService: MapsService) {}

  ngOnInit() {
    this.loadMessages();
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  centerOnMessage(message: LocationMessage): void {
    if (this.map) {
      this.map.setView([message.latitude, message.longitude], 13);
    }

     // Skrolovanje do mape
     this.mapContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  loadMessages() {
    this.locationMessageService.getAllLocationMessages().subscribe((messages: LocationMessage[]) => {
      this.messages = messages;
      this.loadMarkers();
    });
  }

    // Inicijalizacija mape
    private initMap(): void {
      if (typeof window !== 'undefined') {
        import('leaflet').then(L => {
          this.L = L;
          this.map = this.L.map('map', {
            center: [39.2396, 18.8227],  // Postavite početnu lokaciju, na primer, centar sveta
            zoom: 13,
          });
  
          const tiles = this.L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 18,
              minZoom: 3,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }
          );
          tiles.addTo(this.map);
        });
      }
    }
  
    // Dodavanje markera za poruke
    private loadMarkers(): void {
      this.messages.forEach(message => {
        const messageLocationIcon = this.L.icon({
          iconUrl: 'assets/message_icon.png',  // Zamenite sa odgovarajućom ikonom
          iconSize: [30, 30],
          iconAnchor: [15, 45],
          popupAnchor: [0, -45],
          shadowSize: [50, 50],
        });
  
        const marker = this.L.marker([message.latitude, message.longitude], { icon: messageLocationIcon })
          .addTo(this.map)
          .bindPopup(`<b>${message.name}</b><br>${message.street}, ${message.city}, ${message.postalCode}`);
  
        // Dodajte event listener na klik za centriranje mape na lokaciju poruke
        marker.on('click', () => {
          this.map.setView([message.latitude, message.longitude], 13); // Centrirajte mapu na tu lokaciju
        });
      });
    }
}
