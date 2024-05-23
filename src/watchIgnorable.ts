import { ref, watch } from "vue";
import type {
  WatchOptions,
  WatchOptionsBase,
  WatchCallback,
  WatchSource,
} from "vue";

function watchIgnorable<T>(
  source: WatchSource<T>,
  cb: WatchCallback,
  options: WatchOptions & WatchOptionsBase = { flush: "pre" }
) {
  const isSyncFlush = options.flush === "sync";
  const ignoring = ref(false);
  watch(
    source,
    (...args) => {
      if (!ignoring.value) {
        cb(...args);
      }
      if (ignoring.value && !isSyncFlush) {
        ignoring.value = false;
      }
    },
    options
  );
  const ignoreUpdates = (updater: () => void) => {
    ignoring.value = true;
    updater();
    if (isSyncFlush) {
      ignoring.value = false;
    }
  };
  return {
    ignoreUpdates,
  };
}

export default watchIgnorable;
