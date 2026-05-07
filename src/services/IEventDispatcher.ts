export default interface IEventDispatcher {

    emit(eventName: string, payload: Record<string, any>): void

}