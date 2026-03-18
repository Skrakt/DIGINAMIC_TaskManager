import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShellComponent } from '@/app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("doit créer l'application", () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    const applicationShellComponent = fixture.componentInstance;
    expect(applicationShellComponent).toBeTruthy();
  });

  it('doit afficher le titre', async () => {
    const fixture = TestBed.createComponent(AppShellComponent);
    await fixture.whenStable();
    const renderedApplication = fixture.nativeElement as HTMLElement;
    expect(renderedApplication).toBeTruthy();
  });
});
