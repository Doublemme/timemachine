import { TimeMachine } from "../src/stack";

const timeMachine = new TimeMachine<number>();

test("insert values in the history stack", () => {
  expect(timeMachine.peek()).toBe(undefined);
  timeMachine.push(10);
  timeMachine.push(9);
  timeMachine.push(32);
  expect(timeMachine.peek()).toBe(32);
  timeMachine.push(13);
  timeMachine.push(78);
  expect(timeMachine.peek()).toBe(78);
});

test("undo and redo in the history stack", () => {
  timeMachine.undo();
  timeMachine.undo();
  expect(timeMachine.peek()).toBe(32);
  timeMachine.redo();
  expect(timeMachine.peek()).toBe(13);
  timeMachine.push(87);

  function redoCallback(stack: number) {
    expect(stack).toBe(87);
  }

  timeMachine.redo(redoCallback);
  expect(timeMachine.peek()).toBe(87);
});
