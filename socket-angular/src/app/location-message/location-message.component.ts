import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationMessageService } from './location-service/location-message-service.service';

@Component({
  selector: 'app-location-message',
  templateUrl: './location-message.component.html',
  styleUrls: ['./location-message.component.css']
})
export class LocationMessageComponent {
  locationForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}$')]),
    latitude: new FormControl('', [Validators.required, Validators.min(-90), Validators.max(90)]),
    longitude: new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)])
  });

  constructor(private locationService: LocationMessageService) {}

  onSubmit() {
    if (this.locationForm.valid) {
      this.locationService.sendLocation(this.locationForm.value).subscribe({
        next: () => alert('Lokacija uspešno poslata!'),
        error: () => alert('Greška prilikom slanja lokacije.')
      });
    }
  }
}
