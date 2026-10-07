import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-origen',
  imports: [NgOptimizedImage],
  templateUrl: './origen.html',
  styleUrl: './origen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Origen {}
