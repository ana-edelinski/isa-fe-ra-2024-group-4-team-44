import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';
import { User } from '../profile/user.model';
import { Post } from '../model/post.model';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../post.service';


@Component({
  selector: 'app-posts-on-map',
  standalone: true,
  templateUrl: './posts-on-map.component.html',
  styleUrls: ['./posts-on-map.component.css']
})
export class PostsOnMapComponent implements AfterViewInit {
  private map: any;
  private isBrowser: boolean;
  private L: any;
  private user: User | undefined;
  private posts: Post[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService, private postService: PostService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private async initMap(): Promise<void> {
    if (!this.isBrowser) {
      return; 
    }

    this.L = await import('leaflet'); 

    this.map = this.L.map('map', {
      center: [39.2396, 18.8227],
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
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initMap().then(() => {
        let DefaultIcon = this.L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
        });

        this.L.Marker.prototype.options.icon = DefaultIcon;

        this.loadUser();
        this.loadPosts();
      });
    }
  }

  loadUser(): void {
    this.authService.getUserProfile().subscribe(
      (data: User|null) => {
        if (data) {
          this.user = data;
          console.log('User profile fetched successfully', data);


          if (this.user.latitude && this.user.longitude) {
            this.map.setView([this.user.latitude, this.user.longitude], 13);
          }
        } else {
          console.error('No user profile data available');
        }
      },
      (error: any) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  loadPosts(): void {
    this.postService.getAll().subscribe(
      (data: Post[]) => {
        this.posts = data;
        console.log('Fetched all posts:', this.posts);

        this.posts.forEach(post => {
          if (post.locationLatitude && post.locationLongitude) {
            const marker = this.L.marker([post.locationLatitude, post.locationLongitude]).addTo(this.map);
            marker.bindPopup(`<b>${post.creatorUsername}</b><br>${post.description}`);
          }
        });
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  // registerOnClick(): void {
  //   this.map.on('click', (e: any) => {
  //     const coord = e.latlng;
  //     const lat = coord.lat;
  //     const lng = coord.lng;
  //     console.log('You clicked the map at latitude: ' + lat + ' and longitude: ' + lng);
  //     new this.L.Marker([lat, lng]).addTo(this.map);
  //   });
  // }
}
