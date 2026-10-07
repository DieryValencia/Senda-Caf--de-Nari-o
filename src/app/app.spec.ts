import { TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the home page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero h1')?.textContent).toContain('Café de origen');
  });

  it('should navigate from home to the origin page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const regionalInfoButton = fixture.nativeElement.querySelector(
      '.origin-copy button',
    ) as HTMLButtonElement;
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    regionalInfoButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.origin-hero h1')?.textContent).toContain(
      'Producción de café',
    );
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
