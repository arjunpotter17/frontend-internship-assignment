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
  searchTerm:string;
  allBooks: Book[] = [];
  novalues: boolean = false;
  partValues: Book[] = [];
  count:number = 1;
  lower:number = 0;
  higher:number = 10;
  outputLength: number = 0;
  

  constructor(
    private subjectsService: SubjectsService,
    private ngxService: NgxUiLoaderService
    ) {
    this.bookSearch = new FormControl('');
    this.searchToggle = false;
    this.searchTerm = '';
  }

  searchedBooks() {
    if(localStorage.getItem(`${this.searchTerm}`)){
      const output:string = localStorage.getItem(`${this.searchTerm}`)!;
      this.allBooks = JSON.parse(output);
      console.log('this is output from localStorage', this.allBooks)
      this.outputLength = this.allBooks.length;
      this.partValues = this.allBooks.slice(0,10);
      this.ngxService.stop();
      
    }
    else{
      this.subjectsService.searchForBooks(this.searchTerm).subscribe((data) => {
        localStorage.setItem(this.searchTerm, JSON.stringify(data?.docs))
        this.outputLength = data?.docs.length;
        this.setter(data?.docs)
        this.allBooks = data?.docs;
        this.partValues = data?.docs.slice(0,10);
        console.log(this.allBooks)
        if(this.allBooks.length == 0){
          this.novalues = true;
        }
        // this.subjectsArray = data;
        this.ngxService.stop();
          
      });
    }  
  }

  setter(data:Book[]) {
    this.allBooks = data;
    this.partValues = this.allBooks.slice(this.lower, this.higher);

  }
  

    clicker(event:any){
    this.ngxService.start();
    this.searchTerm= (event.target as HTMLInputElement).value;
    (event.target as HTMLInputElement).value = '';
    this.searchToggle = true;
    this.searchedBooks();
  }

  nextPage(){
    if(this.count<(this.allBooks.length/10)){
      this.count++;
      this.lower = (this.count-1)*10
      this.higher = (this.count-1)*10+10;
      this.setter(this.allBooks)
    }
  }

  prevPage(){
    if(this.count>1){
      this.count--;
      this.lower = (this.count-1)*10
      this.higher = (this.count-1)*10+10;
      this.setter(this.allBooks)
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
