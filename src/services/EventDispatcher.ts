import type IEventDispatcher from "./IEventDispatcher";

export default class EventDispatcher implements IEventDispatcher {
    
    emit(eventName: string, payload: Record<string, any>): void {
        // an example fake implementation
        console.log(`EventDispatcher emitted: ${eventName}`, payload)        
    }
}