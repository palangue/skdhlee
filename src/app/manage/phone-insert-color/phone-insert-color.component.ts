import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IColorSet } from '../../../models/PhoneDetail';

@Component({
  selector: 'app-phone-insert-color',
  templateUrl: './phone-insert-color.component.html',
  styleUrls: ['./phone-insert-color.component.css']
})
export class PhoneInsertColorComponent implements OnInit, OnDestroy {

  colorName: string;
  colorValue: string;
  deviceColorSet: Array<IColorSet>;

  constructor(
    public dialogRef: MatDialogRef<Array<IColorSet>>,
    @Inject(MAT_DIALOG_DATA) public data: Array<IColorSet>
    ) { }

  ngOnInit(): void {
    console.log('incomming color = ', this.data);
    this.deviceColorSet = this.data;
  }
  ngOnDestroy(): void{

  }
  btnAddColor(): void{
    console.log(this.data);
    if( this.colorName.length > 0 || this.colorValue.length > 0 ){
      this.deviceColorSet.push({name: this.colorName, value: this.colorValue})
      console.log(this.deviceColorSet);
      this.dialogRef.close({
        code: 0,
        message: '성공',
        colorSet: this.deviceColorSet
      });
    }
    else{
      alert('데이터를 확인 해 주세요');
    }
  }
  btnCancel(): void{
    this.dialogRef.close({
      code: 99,
      message: '취소'
    });
  }
}
