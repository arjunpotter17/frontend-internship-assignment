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
  searchToggle: boolean = false; //toggle variable to remove placeholder text
  searchTerm: string = ''; //variable that stores the term entered in the searchbox
  allBooks: Book[] = []; //variable to store results
  novalues: boolean = false; //toggle variable in case book isn't available
  count: number = 1;  //page number
  pageLimit: number = 10; // variable that stores number of results in a page (default 10)
  offset: number = 0; //offset variable to modify url as per query



  constructor(
    private subjectsService: SubjectsService,
    private ngxService: NgxUiLoaderService
  ) {
    this.bookSearch = new FormControl('');
  }

  // function to subscribe to the openLibrary API
  searchedBooks() {

    //check if result already exists in localStorage
    if (localStorage.getItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`)) {
      const output = JSON.parse(localStorage.getItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`)!)
      this.allBooks = output;
      //stop loader
      this.ngxService.stop();
    }
    else {
      //start loader
      this.ngxService.start();

      this.subjectsService.searchForBooks(this.searchTerm, this.pageLimit, this.offset).subscribe((data) => {
        console.log('API called')
        this.allBooks = data?.docs;
        if (this.allBooks.length == 0) {
          this.novalues = true;
        }
        else {
          //store results in localStorage
          localStorage.setItem(`${this.searchTerm}:${this.count}:${this.pageLimit}`, JSON.stringify(data?.docs))
        }
        this.ngxService.stop();
      });
    }

  }



  //function that takes value from input and sets results per page
  pageLimitSetter() {
    const element = document.getElementById('pageLimit') as HTMLInputElement;
    const value = element.value;
    if(value === ''){
      alert('set a valid limit');
    }
    else{
      this.ngxService.start()
      console.log('this is type of value',typeof value);
      this.pageLimit = parseInt(value);
      this.count = 1;
      this.searchedBooks();
    }
    
  }


  //function that runs when searched
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

  //function to travel to next page
  nextPage() {
    this.count++;
    this.offset = this.count * this.pageLimit;
    this.searchedBooks()
  }

  //function to travel to previous page
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
    { name: 'Angular' },
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
