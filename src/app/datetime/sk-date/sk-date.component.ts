import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sk-date',
  templateUrl: './sk-date.component.html',
  styleUrls: ['./sk-date.component.css']
})
export class SkDateComponent implements OnInit {

  @Output() onDateChange = new EventEmitter<number>();

  sub: Subscription;

  datetimeFormGroup: FormGroup;
  datetimeCtrl = new FormControl(new Date());

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {

    // this.sub = this.datetimeCtrl.valueChanges();
    console.log('date picker income');
  }

  dateChange(event): void {
    // 1591763440540
    // 1606463519000
    this.onDateChange.emit((event.value));
  }
  testfunction(): void {

  }
}
