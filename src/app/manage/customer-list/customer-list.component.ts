import { ICustomerMore } from './../../../models/Customer';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { ICustomer } from '../../../models/Customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  animations: [
    trigger('expandCustInfo', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class CustomerListComponent implements OnInit, OnDestroy {

  customerColumnData = ['submitDate', 'name', 'phone', 'done'];
  customerSource: MatTableDataSource<ICustomer>;
  subCustomer: Subscription;
  expandElement: ICustomer | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.subCustomer = this.firestore.
      collection('customers')
      .valueChanges({ idField: 'idx' })
      .subscribe((ref: any[]) => {
        console.log(ref);

        const customers = Array.from(ref);
        this.customerSource = new MatTableDataSource(customers);
        this.customerSource.paginator = this.paginator;
        this.customerSource.sort = this.sort;
      });
  }


  ngOnDestroy(): void {
    if (this.subCustomer) {
      this.subCustomer.unsubscribe();
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customerSource.filter = filterValue.trim().toLowerCase();

    if (this.customerSource.paginator) {
      this.customerSource.paginator.firstPage();
    }
  }

  btnCompleteRequest(item): void {
    console.log(item);
    item.isDone = 'Y';
    this.firestore.collection('customers').doc(item.idx).update(item);
  }
}
