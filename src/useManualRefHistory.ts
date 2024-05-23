import { ref, watch } from "vue";
import type { UseRefHistoryReturn } from "./useRefHistory";
import type { Ref } from "vue";

// https://play.vuejs.org/#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

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
