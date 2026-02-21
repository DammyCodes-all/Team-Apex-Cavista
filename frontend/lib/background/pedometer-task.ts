import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { usePedometerStore } from "@/stores/pedometer-store";

const PEDOMETER_TASK = "pedometer-background-fetch";

TaskManager.defineTask(PEDOMETER_TASK, async () => {
  try {
    const { refreshTodaySteps } = usePedometerStore.getState();
    await refreshTodaySteps();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerPedometerBackgroundTask = async () => {
  if (Platform.OS === "web") {
    return;
  }

  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    return;
  }

  const tasks = await TaskManager.getRegisteredTasksAsync();
  const alreadyRegistered = tasks.some((task) => task.taskName === PEDOMETER_TASK);

  if (alreadyRegistered) {
    return;
  }

  await BackgroundFetch.registerTaskAsync(PEDOMETER_TASK, {
    minimumInterval: 15 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};
