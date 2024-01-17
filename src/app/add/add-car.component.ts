import { Component, OnInit } from '@angular/core';
import { ICar } from "../models/car";
import { ICarCategory } from "../models/category";
import { RadioType } from "../models/car";
import { FormBuilder, NgForm, NgModel } from '@angular/forms';
import { CarService } from '../service/car.service';
import { Observable, find } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import {Validators} from '@angular/forms'

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent implements OnInit {
  // pageTitle: string = 'Add a car';
  addedCategory?: string;
  subscriptionCategories = Observable<ICarCategory[]>;
  types?: Array<string>;
  categories?: Array<ICarCategory>;
  addedCar?: ICar;

  carForm = this.fb.nonNullable.group({
    vin: <number | null>null,
    color: ['', Validators.required],
    brand: ['', Validators.required],
    doorNr: <number | null>null,
    category: this.fb.nonNullable.group({
      name: ['', Validators.required],
      engineCapacity: <number | null>null,
      weight: <number | null>null,
    }),
    airConditioning: <boolean | null>null,
    electricWindow: <boolean | null>null,
    parkingSenzor: <boolean | null>null,
    USBPort: <boolean | null>null,
    parktronicSystem: <boolean | null>null,
    infotainmentSystem: <boolean | null>null,
    radio: <RadioType | null>null,
    type: ['', Validators.required]

  }
  );

  constructor(private _carService: CarService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._carService.getCategories().subscribe(categories => this.categories = categories);
    this.types = ["Budget", "Premium", "Luxury"];
    // const vin = parseInt(this.route.snapshot.paramMap.get('vin')!, 10);
    // //const carVin = this.route.snapshot.params['vin'];
    // if (!vin) return;
    // this._carService.getCar(vin).subscribe((car) => {
    //   if (!car) return;
    //   this.carForm.controls["vin"].setValue(car.vin);

    // });

  }

   onSubmit() {
    console.log('in onSubmit: ', this.carForm.valid);
     this.addedCar = this.carForm.getRawValue();

     if (this.addedCar.vin){
        let vinn: number = + this.addedCar.vin ;
        this.addedCar.vin = vinn;
      }
      if (this.addedCar.doorNr){
        let nr: number = + this.addedCar.doorNr ;
        this.addedCar.doorNr = nr;
      }



      if (this.addedCar.type == "Budget") {
        this.addedCar.airConditioning = false;
        this.addedCar.electricWindow = false;
        this.addedCar.parkingSenzor = false;
        this.addedCar.USBPort = false;
        this.addedCar.parktronicSystem = false;
        this.addedCar.infotainmentSystem = false;
        this.addedCar.radio = RadioType.ANALOG;
      }
      else if (this.addedCar.type == "Premium"){
        this.addedCar.airConditioning = true;
        this.addedCar.electricWindow = true;
        this.addedCar.parkingSenzor = true;
        this.addedCar.USBPort = true;
        this.addedCar.parktronicSystem = false;
        this.addedCar.infotainmentSystem = false;
        this.addedCar.radio = RadioType.DIGITAL;
      }
      else if (this.addedCar.type == "Luxury"){
        this.addedCar.airConditioning = true;
        this.addedCar.electricWindow = true;
        this.addedCar.parkingSenzor = true;
        this.addedCar.USBPort = true;
        this.addedCar.parktronicSystem = true;
        this.addedCar.infotainmentSystem = true;
        this.addedCar.radio = RadioType.DIGITAL;
     }
     this._carService.getCategories().subscribe(
        categories =>{ this.categories = categories},
        error => {

          console.log('error', error)
          }
        );
     if (this.categories != null){
     const selectedCategory = this.categories.find(s => s.name == this.addedCar?.category?.name);
     if (this.addedCar!= null){
         this.addedCar.category = selectedCategory != null ? selectedCategory : null;
     }}

     this._carService.addCar(this.addedCar).subscribe(
              result =>{
               this.router.navigate(['/cars']);
               console.log('success: ', result);

              },
              error => {
                console.log('error', error);
              }
      );



    //const win: Window = window;
    //win.location = "http://localhost:4200/cars";
    //window.location.assign( "http://localhost:5120/api/car");

  }
}
