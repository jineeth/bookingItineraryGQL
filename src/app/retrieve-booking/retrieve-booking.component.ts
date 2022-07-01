import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GetItineraryService } from '../services/get-itinerary.service';
import { GET_BOOKING } from '../graphql/graphql.queries';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-retrieve-booking',
  templateUrl: './retrieve-booking.component.html',
  styleUrls: ['./retrieve-booking.component.scss']
})
export class RetrieveBookingComponent implements OnInit {

  showError: boolean = false;
  errorMessage: string = '';
  logonForm: FormGroup = new FormGroup({})
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private fb: FormBuilder, private router: Router, public getItineraryService: GetItineraryService, public apollo: Apollo) {
  }

  ngOnInit() {
    this.createlogonForm();
  }
  createlogonForm() {
    this.logonForm = this.fb.group({
      bookingCode: ['', [Validators.required, Validators.pattern(/^(?:[a-zA-Z2-9]+)?$/), Validators.minLength(5), Validators.maxLength(6)]],
      familyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],

    });
  }
  onRetrieveBooking() {
    console.log('onRetrieveBooking')
    if (!this.logonForm.valid) {
      return
    }

    this.showError = false;

    this.apollo.watchQuery({
      query: GET_BOOKING,
      variables: {
        "bookingCode": this.logonForm.controls['bookingCode'].value,
        "familyName": this.logonForm.controls['familyName'].value
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      if (data.booking !== null && data.booking !== undefined) {
        this.getItineraryService.setItinerary(data.booking);
        this.router.navigate(['/flight']);
      }
      else {
        this.showError = true;
        this.errorMessage = 'Unknown error'
      }


    }
    );

  }

  setErrorMessage(error: any): void {
    switch (error.status) {
      case 400: {
        this.errorMessage = error?.error?.message;
        break;
      }
      case 403: {
        this.errorMessage = error?.error?.message;
        break;
      }
      case 500: {
        this.errorMessage = error?.error?.message;
        break;
      }
      default: {
        this.errorMessage = 'Unknown Error, Please try later ';
        break;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
