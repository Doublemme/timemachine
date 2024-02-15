type _TreeNode<T> = {
  parent: _TreeNode<T> | null;
  children: _TreeNode<T>[];
  data: T;
};

export class TreeTimeMachine<T> {
  private root: _TreeNode<T>;
  private head: _TreeNode<T>;

  constructor(initialData: T) {
    this.root = {
      data: initialData,
      parent: null,
      children: [],
    };
    this.head = this.root;
  }

  /**
   * Insert a new node in the history tree after the current head node
   * @param data The value of the node
   */
  insert(data: T) {
    const newNode: _TreeNode<T> = {
      parent: this.head,
      children: [],
      data,
    };
    this.head.children.push(newNode);
    this.head = newNode;
  }

  /**
   * Read the currente head node and return its value
   *
   * @returns The value of the current node
   */
  peek(): T {
    return this.head.data;
  }

  /**
   * Restore the previous state from the currrent node
   * @param callback A custom action invoked after the undo
   */
  undo(callback?: (nodeData: T) => void) {
    this.head = this.head.parent ? this.head.parent : this.root;
    if (callback) {
      callback(this.head.data);
    }
  }

  /**
   * Restore the next node in the tree, if multiple branches are available
   * you need to provide the branch index otherwise an error will be throw.
   * @param childIdx The branch index to navigate to
   * @param callback A custom action invoked after the redo
   */
  redo(childIdx?: number, callback?: (nodeData: T) => void) {
    if (this.head.children.length > 1 && childIdx === undefined) {
      throw new Error(
        "Multiple branches can be redo, provide the index of the desired one"
      );
    }
    //Set a default value of the child node to peek when no childIdx is provided (works only if head children is = 1)
    const nextNodeIdx = childIdx ? childIdx : 0;

    this.head = this.head.children[nextNodeIdx];
    if (callback) callback(this.head.data);
  }
}
