import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchToggle: boolean;
  searchTerm: string;
  allBooks: Book[] = [];
  novalues: boolean = false;
  count: number = 1;
  pageLimit: any = 10;
  offset: any = 0;



  constructor(
    private subjectsService: SubjectsService,
    private ngxService: NgxUiLoaderService
  ) {
    this.bookSearch = new FormControl('');
    this.searchToggle = false;
    this.searchTerm = '';
  }

  searchedBooks() {
    if (localStorage.getItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`)) {
      const output = JSON.parse(localStorage.getItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`)!)
      this.allBooks = output;
      this.ngxService.stop();
    }
    else {
      this.ngxService.start();
      this.subjectsService.searchForBooks(this.searchTerm, this.pageLimit, this.offset).subscribe((data) => {
        console.log('API called')
        this.allBooks = data?.docs;
        if (this.allBooks.length == 0) {
          this.novalues = true;
        }
        else {
          localStorage.setItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`, JSON.stringify(data?.docs))
        }
        this.ngxService.stop();
      });
    }

  }



  pageLimitSetter() {
    this.ngxService.start()
    const element = document.getElementById('pageLimit') as HTMLInputElement;
    const value = element.value;
    this.pageLimit = value;
    console.log('this is new pageLimit', this.pageLimit)
    this.count = 1;
    this.searchedBooks();
  }


  clicker() {
    const element = document.getElementById('searchbox')
    if (!(element as HTMLInputElement).value) {
      alert('enter a search value')
    }
    else {
      this.ngxService.start();

      this.searchTerm = (element as HTMLInputElement).value;
      (element as HTMLInputElement).value = '';
      this.searchToggle = true;
      this.searchedBooks();
    }

  }

  nextPage() {
    this.count++;
    this.offset = this.count * this.pageLimit;
    this.searchedBooks()
  }

  prevPage() {
    if (this.count > 1) {
      this.count--;
      this.offset = this.count * this.pageLimit;
      this.searchedBooks()
    }

  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'njdkwnfk' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {

      });
  }
}
