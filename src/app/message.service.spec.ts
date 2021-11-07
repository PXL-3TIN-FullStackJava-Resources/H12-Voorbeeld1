import { MessageService } from "./message.service";

describe('MessageService',()=>{
    let service: MessageService;
    beforeEach(()=>{
        service = new MessageService();
    });

    it('should have no messages to start', ()=>{
        expect(service.messages.length).toBe(0);
    });

    it('should add message',()=>{
        service.add('message');
        expect(service.messages.length).toBe(1);
    });
    
    it('should clear messages',()=>{
        service.add('message');
        service.clear();
        expect(service.messages.length).toBe(0);
    });
});
