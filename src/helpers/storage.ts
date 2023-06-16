// Singleton object providing a global store for objects put inside entities
export default {
    storage: new Map<number, any>(),
    index: 0,

    add(item: any): number {
        this.index += 1
        this.storage.set(this.index, item)
        return this.index
    },

    get(id: number): any {
        return this.storage.get(id)
    },

    delete(id: number): void {
        this.storage.delete(id)
    }
}
