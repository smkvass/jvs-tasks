1.How your closure keeps the task counter private.

My closure keeps the counter private because count is inside of createTask function.It cannot be accessible outside.I can only change or get it using run(), getCount() and reset().

2.How the call stack works in one example from your application.

When I call task1.run(), the function is added to the call stack.JavaScript executes the function and creates the Promise then calls setTimeout.Then run() finishes and is removed from the call stack.

3.How JavaScript can continue while setTimeout is waiting.

setTimeout does not block JavaScript.The timer is handled by the browser, so JS can continue executing other code.When the timer finishes, the callback is added to the task queue and will be executed later.

4.Your predicted and actual Event Loop output.

My predicted output was: 1, Async function start, 6, Promise callback 1, Promise callback 2, Async function after await, Timer 1, Timer 2.The actual output was the same. Synchronous code runs first.After that, microtasks from Promises and await run.Finally, the setTimeout callbacks run.

5.The difference between tasks and microtasks.

Microtasks have more priority than tasks.After the current synchronous code finishes, JS executes the microtasks first, and then it takes a task from the task queue.

6.How you handle multiple Promises and errors.

I use Promise.allSettled() to handle multiple Promises.It waits for all tasks, even if some of them fail.For each result,I check if the status is fulfilled or rejected.

7.The difference between sequential and concurrent execution.

In sequential execution, I wait for the first task before starting the second task.In concurrent execution, I start the tasks at the same time. I don't wait for one task before starting another.
