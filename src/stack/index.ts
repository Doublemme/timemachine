export class TimeMachine<T> {
  readonly maxSize: number;

  private undoHead: number;
  private redoHead: number;
  private redoStack: T[];
  private undoStack: T[];

  constructor(maxSize?: number) {
    this.maxSize = maxSize ? maxSize : 100;
    this.redoHead = -1;
    this.undoHead = -1;
    this.undoStack = new Array().fill(undefined as T, 0, this.maxSize - 1);
    this.redoStack = [];
  }

  /**
   * Insert a new item at the top of the history stack
   * @param stackHeadEl The element to add into the history stack
   */
  push(stackHeadEl: T) {
    if (this.undoStack.length === this.maxSize) {
      this.undoStack.shift();
    }
    this.undoStack.push(stackHeadEl);
    this.undoHead = this.undoStack.length - 1;
    this.clearRedoStack();
  }

  /**
   * Peek the item at the top of the history stack
   *
   * @returns The item at the head of the history stack
   */
  peek(): T {
    return this.undoStack[this.undoHead];
  }

  /**
   * Remove the last pushed item
   * @param {(stackHeadEl:T)=>void} callback A callback for a custom action when the undo command is invoked
   */
  undo(callback?: (stackHeadEl: T) => void) {
    //Pop the last inserted el in the undo stack
    const el = this.undoStack.pop();
    //Reduce the undo head pointer by 1
    if (el) {
      this.undoHead = this.undoStack.length - 1;
      //Push the popped el into the redo stack
      this.redoStack.push(el);
      //Increment the redo head pointer by 1
      this.redoHead += 1;
    }

    if (callback) callback(this.undoStack[this.undoHead]);
  }

  /**
   * Restore the last undo commit
   * @param {(stackHeadEl:T)=>void} callback A callback for a custom action when the redo command is invoked
   */
  redo(callback?: (stackHeadEl: T) => void) {
    //Pop the last inserted el in the redo stack
    const el = this.redoStack.pop();
    //Reduce the redo head pointer by 1
    if (el) {
      this.redoHead = this.redoStack.length - 1;
      //Push the popped el into the undo stack
      this.undoStack.push(el);
      //Increment the undo head pointer by 1
      this.undoHead += 1;
    }

    if (callback) callback(this.undoStack[this.undoHead]);
  }

  /**
   * Used to reset the redo stack, ususally invoked when a new item is pushed into the undo stack
   */
  private clearRedoStack() {
    this.redoStack = [];
  }
}
