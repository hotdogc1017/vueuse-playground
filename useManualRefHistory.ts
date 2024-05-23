import { ref, watch } from "vue";
import type { UseRefHistoryReturn } from "./useRefHistory";
import type { Ref } from "vue";

export interface UseManualRefHistoryReturn extends UseRefHistoryReturn {
  commit: () => void;
  undoUpdate: () => void
}

function useRefHistory(
  source: Ref
): UseManualRefHistoryReturn {
  const history = ref([source.value]);
  const updateCount = ref(0);

  watch(source, () => {
    updateCount.value++;
  })
  const _commit = () => {
    const first = history.value[0];
    if (source.value === first) {
      return;
    }
    history.value.unshift(source.value);
    updateCount.value = 0;
  };

  const undoUpdate = () => {
    if (updateCount.value > 0) {
      const cur = history.value[0];
      source.value = cur;
    }
  }

  const undo = () => {
    if (history.value.length > 1) {
      history.value.shift();
      source.value = history.value[0];
    }
  }

  const clear = () => {
    const latest = history.value[0];
    history.value = [latest];
    source.value = latest;
  };

  return {
    source,
    history,
    clear,
    undo,
    undoUpdate,
    commit: _commit,
  };
}

export default useRefHistory;
