import { ref } from "vue";
import watchIgnorable from "./watchIgnorable.ts";
import type { Ref, WatchOptions, WatchOptionsBase } from "vue";

export interface UseRefHistoryOptions {
  watchOptions: WatchOptions & WatchOptionsBase;
}

export interface UseRefHistoryReturn {
  source: Ref;
  history: Ref<any[]>;
  clear: () => void;
  undo: () => void;
}

function useRefHistory(source: Ref): UseRefHistoryReturn;
function useRefHistory(
  source: Ref,
  options: UseRefHistoryOptions
): UseRefHistoryReturn;
function useRefHistory(
  source: Ref,
  options: UseRefHistoryOptions | (WatchOptions & WatchOptionsBase) = {}
): UseRefHistoryReturn {
  let watchOptions: WatchOptions & WatchOptionsBase;
  if ("watchOptions" in options) {
    ({ watchOptions } = options);
  } else {
    watchOptions = options;
  }
  const history = ref([source.value]);

  const _commit = () => {
    history.value.unshift(source.value);
  };

  const { ignoreUpdates } = watchIgnorable(source, _commit, watchOptions);

  const undo = () => {
    ignoreUpdates(() => {
      if (history.value.length > 1) {
        history.value.shift();
        source.value = history.value[0];
      }
    });
  };

  const clear = () => {
    ignoreUpdates(() => {
      const [latest] = history.value.reverse();
      history.value = [latest];
      source.value = latest;
    });
  };

  return {
    source,
    history,
    clear,
    undo,
  };
}

export default useRefHistory;
