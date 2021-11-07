import { TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService',() => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService}
      ]
    });
    // Zorgt dat de testing controller aanspreekbaar is via httpTestingContoller
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getHero', () => {
    it('should return the correct hero object', () => {
      const heroService = TestBed.inject(HeroService);
      heroService.getHero(4).subscribe(hero => {
        expect(hero.id).toBe(4);
      });
      // Test of de url juist was
      const req = httpTestingController.expectOne('api/heroes/4');
      // flush stuurt de data terug als de call gemaakt is
      req.flush({id: 4, name: 'SuperDude', strength: 100});
      httpTestingController.verify(); // controleren op eventueel openstaande requests

    });
  });

});
