import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { UserModel } from 'src/app/modules/auth';
import { ISale } from 'src/app/pages/interfaces/isale';
import { RepositoryService } from 'src/app/pages/services/repository.service';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  user!: UserModel;
  keyword = '';
  searching = false;
  allData: ISale[] = [];
  resultData: ISale[] = [];

  constructor(
    private repositoryService: RepositoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { this.loadData(); }

  private loadData(): void {
    this.repositoryService.getAllDataFiltered('sale', {
      type: 'compra',
      limitqty: 25,
      ascending: 'desc',
    }).subscribe({
      next: resp => { this.allData = resp; this.cdr.detectChanges(); },
      error: err => console.error('Error loading data:', err),
    });
  }

  onEnter(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    if (inputValue) this.keyword = inputValue, this.search();
  }

  search(): void {
    this.searching = true;
    this.repositoryService.getAllDataFiltered('sale', {
      type: 'compra',
      folio: this.keyword,
      limitqty: 1,
      ascending: 'desc',
    }).subscribe({
      next: resp => { this.resultData = resp; this.searching = false; this.cdr.detectChanges(); },
      error: () => this.searching = false,
    });
  }

  clearSearch(): void { this.keyword = ''; }
}
