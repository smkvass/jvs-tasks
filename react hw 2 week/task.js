function createTask(taskName) {
    let count = 0;

    return {
        run: function() {
            count++;
            const loadingTime = Math.floor(
                Math.random() * (2000 - 500 + 1) + 500                   // Math.floor(Math.random() * (max - min + 1) + min)
            );

            return new Promise((resolve, reject) => {

                setTimeout(() => {

                    // 50% success, 50% failure
                    const success = Math.random() < 0.5;

                    if (success) {
                        resolve({
                            name: taskName,
                            status: "Completed",
                            time: loadingTime
                        });
                    } else {

                        reject({
                            name: taskName,
                            status: "Failed",
                            time: loadingTime
                        });
                    }
                }, loadingTime);
            });
        },

        getCount: function() {
            return count;
        },

        reset: function() {
            count = 0;
        }
    };
}


const task1 = createTask("Load Users");
const task2 = createTask("Load Posts");
const task3 = createTask("Load Comments");

// Users
const usersStatus = document.querySelector("#users-status");
const usersCount = document.querySelector("#users-count");
const usersTime = document.querySelector("#users-time");

const usersRun = document.querySelector("#users-run");
const usersReset = document.querySelector("#users-reset");


// Posts
const postsStatus = document.querySelector("#posts-status");
const postsCount = document.querySelector("#posts-count");
const postsTime = document.querySelector("#posts-time");

const postsRun = document.querySelector("#posts-run");
const postsReset = document.querySelector("#posts-reset");


// Comments
const commentsStatus = document.querySelector("#comments-status");
const commentsCount = document.querySelector("#comments-count");
const commentsTime = document.querySelector("#comments-time");

const commentsRun = document.querySelector("#comments-run");
const commentsReset = document.querySelector("#comments-reset");



const runAllButton = document.querySelector("#run-all");
const allResult = document.querySelector("#all-result");

const sequentialButton =
    document.querySelector("#sequential-button");

const concurrentButton =
    document.querySelector("#concurrent-button");

const sequentialResult =
    document.querySelector("#sequential-result");

const concurrentResult =
    document.querySelector("#concurrent-result");

const eventLoopButton =
    document.querySelector("#event-loop-button");



//UPDATE TASK UI
function updateTaskUI(
    task,
    statusElement,
    countElement,
    timeElement
) {

    statusElement.textContent = "Loading...";

    const startTime = performance.now();

    task.run()

        .then(function(result) {

            const endTime = performance.now();

            statusElement.textContent = result.status;

            timeElement.textContent =
                Math.round(endTime - startTime) + " ms";

            countElement.textContent =
                task.getCount();

        })

        .catch(function(error) {

            const endTime = performance.now();

            statusElement.textContent = error.status;

            timeElement.textContent =
                Math.round(endTime - startTime) + " ms";

            countElement.textContent =
                task.getCount();

        });
}


// 5. USERS
usersRun.addEventListener("click", function() {

    updateTaskUI(
        task1,
        usersStatus,
        usersCount,
        usersTime
    );

});


usersReset.addEventListener("click", function() {

    task1.reset();

    usersStatus.textContent = "Idle";
    usersCount.textContent = task1.getCount();
    usersTime.textContent = "-";

});


// 6. POSTS
postsRun.addEventListener("click", function() {

    updateTaskUI(
        task2,
        postsStatus,
        postsCount,
        postsTime
    );

});


postsReset.addEventListener("click", function() {

    task2.reset();

    postsStatus.textContent = "Idle";
    postsCount.textContent = task2.getCount();
    postsTime.textContent = "-";

});


// 7. COMMENTS
commentsRun.addEventListener("click", function() {

    updateTaskUI(
        task3,
        commentsStatus,
        commentsCount,
        commentsTime
    );

});


commentsReset.addEventListener("click", function() {

    task3.reset();

    commentsStatus.textContent = "Idle";
    commentsCount.textContent = task3.getCount();
    commentsTime.textContent = "-";

});


// Run all tasks
runAllButton.addEventListener("click", async function() {

    allResult.textContent = "Running all tasks...";

    const startTime = performance.now();

    const results = await Promise.allSettled([
        task1.run(),
        task2.run(),
        task3.run()
    ]);

    const endTime = performance.now();

    // Update Users
    if (results[0].status === "fulfilled") {

        usersStatus.textContent =
            results[0].value.status;

        usersTime.textContent =
            results[0].value.time + " ms";

    } else {

        usersStatus.textContent =
            results[0].reason.status;

        usersTime.textContent =
            results[0].reason.time + " ms";
    }

    usersCount.textContent =
        task1.getCount();


    // Update Posts
    if (results[1].status === "fulfilled") {

        postsStatus.textContent =
            results[1].value.status;

        postsTime.textContent =
            results[1].value.time + " ms";

    } else {

        postsStatus.textContent =
            results[1].reason.status;

        postsTime.textContent =
            results[1].reason.time + " ms";
    }

    postsCount.textContent =
        task2.getCount();


    // Update Comments
    if (results[2].status === "fulfilled") {

        commentsStatus.textContent =
            results[2].value.status;

        commentsTime.textContent =
            results[2].value.time + " ms";

    } else {

        commentsStatus.textContent =
            results[2].reason.status;

        commentsTime.textContent =
            results[2].reason.time + " ms";
    }

    commentsCount.textContent =
        task3.getCount();


    allResult.textContent =
        "All tasks finished in " +
        Math.round(endTime - startTime) +
        " ms";

});


// 9. SEQUENTIAL

sequentialButton.addEventListener("click", async function() {

    sequentialResult.textContent = "Running...";

    const startTime = performance.now();

    try {

        await task1.run();

    } catch (error) {

        console.log("Users failed:", error);

    }


    try {

        await task2.run();

    } catch (error) {

        console.log("Posts failed:", error);

    }


    try {

        await task3.run();

    } catch (error) {

        console.log("Comments failed:", error);

    }


    const endTime = performance.now();

    sequentialResult.textContent =
        "Finished in " +
        Math.round(endTime - startTime) +
        " ms";

});


//CONCURRENT

concurrentButton.addEventListener("click", async function() {

    concurrentResult.textContent = "Running...";

    const startTime = performance.now();

    await Promise.allSettled([
        task1.run(),
        task2.run(),
        task3.run()
    ]);

    const endTime = performance.now();

    concurrentResult.textContent =
        "Finished in " +
        Math.round(endTime - startTime) +
        " ms";

});


//ASYNC FUNCTION FOR EVENT LOOP

async function asyncDemo() {

    console.log("Async function start");

    await Promise.resolve();

    console.log("Async function after await");

}


//EVENT LOOP DEMO
eventLoopButton.addEventListener("click", function() {

    console.clear();

    console.log("1. Sync code");

    setTimeout(function() {

        console.log("2. Timer 1");

    }, 0);


    setTimeout(function() {

        console.log("3. Timer 2");

    }, 0);


    Promise.resolve().then(function() {

        console.log("4. Promise callback 1");

    });


    Promise.resolve().then(function() {

        console.log("5. Promise callback 2");

    });


    asyncDemo();

    console.log("6. Sync code end");

});

