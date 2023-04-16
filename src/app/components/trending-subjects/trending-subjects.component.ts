import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {

  isLoading: boolean = true;

  subjectName: string = '';

  allBooks: Book[] = [];

  novalues: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private ngxService: NgxUiLoaderService
  ) {}

  getAllBooks() {
   
    this.subjectsService.getAllBooks(this.subjectName).subscribe((data) => {
      
        this.allBooks = data?.works;
      if(this.allBooks.length == 0){
        this.novalues = true;
      }
      //loader stop
      this.ngxService.stop();
      
    });
  }

  ngOnInit(): void {
    //loader start
    this.ngxService.start();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.getAllBooks();
    });
  }

}
