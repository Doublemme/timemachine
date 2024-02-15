import { TreeTimeMachine } from "../src/tree";

const undoTree = new TreeTimeMachine("Hello world");

test("insert node", () => {
  undoTree.insert("Hello it's world");
  undoTree.insert("Hello it's a world");
  undoTree.insert("Hello it's a fantastic world");
  expect(undoTree.peek()).toBe("Hello it's a fantastic world");
});

test("undo changes in tree", () => {
  function undoCallback(data: string) {
    expect(data).toBe("Hello it's a world");
  }

  undoTree.undo(undoCallback);
  undoTree.undo();
  expect(undoTree.peek()).toBe("Hello it's world");
});

test("insertion after some undo", () => {
  undoTree.insert("Hello it's really beautiful");
  undoTree.insert("Hello it's really beautiful this world");
  expect(undoTree.peek()).toBe("Hello it's really beautiful this world");
  undoTree.undo();
  undoTree.undo();
  expect(undoTree.peek()).toBe("Hello it's world");
});

test("redo changes in tree", () => {
  function redoTree() {
    undoTree.redo();
  }
  expect(redoTree).toThrow(
    "Multiple branches can be redo, provide the index of the desired one"
  );

  undoTree.redo(1);
  expect(undoTree.peek()).toBe("Hello it's really beautiful");

  function redoCallback(data: string) {
    expect(data).toBe("Hello it's really beautiful this world");
  }

  undoTree.redo(undefined, redoCallback);
});
