import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from '../material/material.module';
import { TableComponent } from './table/table.component';
import { AutocompleteApiComponent } from './autocomplete-api/autocomplete-api.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AdvancedFilterComponent } from './table/advanced-filter/advanced-filter.component';
import { AutocompleteFilterComponent } from './table/advanced-filter/components/autocomplete-filter/autocomplete-filter.component';
import { DateRangeFilterComponent } from './table/advanced-filter/components/date-range-filter/date-range-filter.component';
import { AutocompleteStaticComponent } from './autocomplete-static/autocomplete-static.component';
import { NewFormComponent } from './new-form/new-form.component';
import { SecurityFormComponent } from './security-form/security-form.component';

@NgModule({
  declarations: [
    LoadingComponent,
    TableComponent,
    AutocompleteApiComponent,
    AdvancedFilterComponent,
    AutocompleteFilterComponent,
    DateRangeFilterComponent,
    AutocompleteStaticComponent,
    NewFormComponent,
    SecurityFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    LoadingComponent,
    TableComponent,
    AutocompleteApiComponent,
    NewFormComponent,
    SecurityFormComponent,
  ],
})
export class ComponentsModule {}
