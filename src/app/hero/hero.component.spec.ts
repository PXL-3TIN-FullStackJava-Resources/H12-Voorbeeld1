import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas:[NO_ERRORS_SCHEMA] // ingore errors related to unknown elements or properties
    });
    // fixture is een wrapper van de component en zijn template
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };

    expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
  });

  it('should render the hero name in an anchor tag',() => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };
    // detectChanges() zorgt ervoor dat de change detection wordt uitgevoerd, inclusief lifecycle hooks zoals bv ngOnInit
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
  });
});
