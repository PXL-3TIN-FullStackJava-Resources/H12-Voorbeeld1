import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

describe('HeroesComponent', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', stength: 12}
    ];

    // SpyObj maakt een object aan met in dit geval 3 methodes, kunnen later controleren of die methodes gecalled zijn
    mockHeroService = jasmine.createSpyObj(['addHero','getHeroes','deleteHero']);
    TestBed.configureTestingModule({
        declarations: [HeroesComponent, HeroComponent],
        providers: [
            // Gebruik de mockHeroService als er gevraagd wordt naar de HeroService dependency
            {provide: HeroService, useValue: mockHeroService}
        ],
        schemas: [NO_ERRORS_SCHEMA] // negeert de child component en/of niet bestaande elementen/attributen
    })
    fixture = TestBed.createComponent(HeroesComponent);
    // Gebruiken debugElement om de heroes property van de component op te vullen met de mock data
    fixture.debugElement.componentInstance.heroes = HEROES; 
  });

  it('should create one li for reach hero', () => {
    // Dit zorgt ervoor dat de HEROES array wordt teruggegeven in een Observable als getHeroes gecalled wordt.
    mockHeroService.getHeroes.and.returnValue(of(HEROES))

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(2);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES))
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentDEs.length).toEqual(2);
    expect(heroComponentDEs[0].componentInstance.hero).toEqual(HEROES[0]);
    expect(heroComponentDEs[1].componentInstance.hero).toEqual(HEROES[1]);
  });

  it('should call heroService.deleteHero when the Hero component delete button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    mockHeroService.deleteHero.and.returnValue(of(true));
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    const deleteButton = heroComponents[0].query(By.css('button'));
    // alternatief:
    // <HeroComponent>heroComponents[0].componentInstance.delite.emit(undefined);
    // of:
    // heroComponents[0].triggerEventHandler('delete', undefined);
    deleteButton.triggerEventHandler('click', {stopPropagation: () => {}});

    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', {stopPropagation: () => {}});
    fixture.detectChanges(); // trigger change detection

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  });

  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      // zorgt ervoor dat de deleteHero van het mock object een observable teruggeeft
      // op die manier kan hierop gesubscribed worden in de test
      mockHeroService.deleteHero.and.returnValue(of(true));

      fixture.debugElement.componentInstance.delete(HEROES[1]);

      expect(fixture.debugElement.componentInstance.heroes.length).toBe(1);
    });

    it('should call deleteHero with the correct value', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));

      fixture.debugElement.componentInstance.delete(HEROES[1]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[1]);
    });
  });

  describe('getHeroes',() => {
    it('should set heroes correctly from the service',() => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES))

      fixture.detectChanges(); // Triggert lifecycle hooks

      expect(fixture.componentInstance.heroes.length).toBe(2);
    });
  });

  describe('add',() =>{
    it('should add hero correctly to the list', () => {
      mockHeroService.addHero.and.returnValue(of({name: "unitman",strength: 11}));

      fixture.debugElement.componentInstance.add("unitman");

      expect(fixture.debugElement.componentInstance.heroes[2].name).toBe("unitman");
    });

    it('should not add a hero when name is not set',() =>{
      mockHeroService.addHero.and.returnValue(of({name: "unitman",strength: 11}));

      fixture.debugElement.componentInstance.add("");

      expect(fixture.debugElement.componentInstance.heroes.length).toBe(2);
    })
  });

});
