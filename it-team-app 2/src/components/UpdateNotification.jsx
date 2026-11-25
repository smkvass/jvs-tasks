import { useState, useEffect } from "react";

export default function UpdateNotification() {
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    let registrationRef;

    async function checkForUpdates() {
      try {
        const registration = await navigator.serviceWorker.ready;
        registrationRef = registration;

        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
            }
          });
        });

        await registration.update();
      } catch (error) {
        console.error("Update check failed:", error);
      }
    }

    checkForUpdates();

    function handleControllerChange() {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
    };
  }, []);

  function updateApp() {
    waitingWorker?.postMessage("SKIP_WAITING");
  }

  if (!waitingWorker) return null;

  return (
    <div className="update-notification">
      <p>New version available!</p>
      <p>A new version of IT Team Manager is ready.</p>
      <button onClick={updateApp}>
        Update application
      </button>
    </div>
  );
}
