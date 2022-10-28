import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlSanitizerPipe } from './url-sanitizer/url-sanitizer.pipe';
import { ObjectFindPipe } from './object-find/object-find.pipe';
import { PatternPipe } from './pattern/pattern.pipe';

@NgModule({
  declarations: [UrlSanitizerPipe, ObjectFindPipe, PatternPipe],
  imports: [CommonModule],
  exports: [UrlSanitizerPipe, ObjectFindPipe, PatternPipe],
})
export class PipesModule {}
