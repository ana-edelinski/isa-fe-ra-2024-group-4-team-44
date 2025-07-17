import { Component , OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Post } from '../model/post.model';
import { PostService } from '../services/post.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../profile/user.model';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MapsService } from '../posts-on-map/maps.service';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatIconModule, 
    FormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,], 
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit, OnDestroy, AfterViewInit {

  map!: L.Map;
  marker!: L.Marker;

  constructor(private postService: PostService, private authService: AuthService, private router: Router, public dialogRef: MatDialogRef<CreatePostComponent>, @Inject(PLATFORM_ID) private platformId: Object, private mapService: MapsService) {}

  user: User = new User();
  private userSubscription: Subscription = Subscription.EMPTY;


  fb = new FormBuilder()
  selectedFile: File | null = null;
  imagePath: string | null = null;

  postForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    address: this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      locationLatitude: ['', Validators.required],
      locationLongitude: ['', Validators.required]

    })
  });

  ngOnInit(): void {
    this.resetImagePath();
    this.postForm.setValue({
      description: '',
      image: '',
      address: {
        city: '',
        street: '',
        postalCode: '',
        locationLatitude: '',
        locationLongitude: ''
      }
    });
    this.userSubscription = this.authService.getUser().subscribe(user => {
      console.log("User from AuthService:", user);
      if (user && user.id) {
        this.user = user; 
      } else {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    // Postavi globalni default marker ikonu (isti kao kod drugarice)
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    // Inicijalizuj mapu
    this.map = L.map('map').setView([45.2671, 19.8335], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this, L));
  }


  private onMapClick(L: any, e: any): void {
    console.log("CLICKED MAP", e); 
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Postavi marker
    if (this.marker) {
      this.marker.setLatLng(e.latlng);
    } else {
      this.marker = L.marker(e.latlng).addTo(this.map);
    }

    // Sačuvaj lat/lng u formu
    this.postForm.get('address.locationLatitude')?.setValue(lat.toString());
    this.postForm.get('address.locationLongitude')?.setValue(lng.toString());

    // Pozovi geocoding servis
    this.mapService.reverseGeocode(lat, lng).subscribe({
    next: (result) => {
      const address = result.address;
      console.log("Geocoding result:", result);

      this.postForm.get('address.city')?.setValue(
        address.city || address.town || address.village || ''
      );

      const street = address.road ? address.road : '';
      const houseNumber = address.house_number ? address.house_number : '';
      const fullStreet = houseNumber ? `${street} ${houseNumber}` : street;

      this.postForm.get('address.street')?.setValue(fullStreet);

      this.postForm.get('address.postalCode')?.setValue(
        address.postcode || ''
      );
    },
    error: (err) => {
      console.error('Error while geocoding:', err);
    }
  });

  }



  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }


  resetImagePath() {
    this.imagePath = null;
    this.selectedFile = null;
    this.postForm.patchValue({
      image: null 
    });
    
  }

  

  onImageSelect(event: any) {
    
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0]; 
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'warning',        
        title: 'Photo missing',
        text: 'Please, add photo to proceed.',
        confirmButtonText: 'OK'
      });
      return;
    }  

    this.postService.uploadImage(this.selectedFile).subscribe( {
      next: (result: any) => {
        console.log(result);
        this.imagePath = result.imagePath;
        this.onPostSubmit()
      },
      error: () => {
        alert('An error has occured uploading the photo.');
      }
    })
  }


  onPostSubmit() {
    console.log("Jesi ili nisi :", this.postForm.valid)



    if (this.postForm.valid) {
      console.log(this.imagePath)
      console.log("Form data:", this.postForm.value);  // Logovanje vrednosti forme
      console.log("Image Path:", this.imagePath);  // Logovanje putanje slike
      console.log("User ID:", this.user.id);  // Logovanje korisničkog ID-a
  
      if(this.imagePath !== null && this.user.id != null){
        const newPost: Post = {
          id: 100,
          creatorId: this.user.id,
          creatorUsername: '',
          description: this.postForm.value.description || '',
          creationTime: new Date(),
          imagePath: this.imagePath, // Dodeljujemo putanju koju smo dobili sa servera
          locationStreet: this.postForm.value.address?.street || '',
          locationCity: this.postForm.value.address?.city || '',
          locationPostalCode: this.postForm.value.address?.postalCode || '',
          locationLatitude: parseFloat(this.postForm.value.address?.locationLatitude || '0'), 
          locationLongitude: parseFloat(this.postForm.value.address?.locationLongitude || '0'), 
          comments: [],
          likes: [],
          likeCount: 0,
          advertised: false
        };
        console.log("New Post to create:", newPost); 
        this.postService.createPost(newPost).subscribe({
          next: (result: Post) => {
            if (result) {
              this.resetImagePath()
              console.log('Post created successfully');
              this.dialogRef.close(newPost); 
              this.router.navigate([''], { state: { user: this.user} });
            } else {
              alert('An error has occurred. Please try again.');
            }
          },
          error: (err) => {
            console.log("Error creating post:", err);
            alert('An error has occurred. Please try again.');
          }
        });
      } else {
        console.log("Error uploading photo")
      }   
    } else {
      Swal.fire({
        icon: 'warning',        
        title: 'Empty fileds',
        text: 'Some fields are still empty, please fill them in to proceed.',
        confirmButtonText: 'OK'
      });
      console.log("Form not valid")
    }
  }

}



  

 