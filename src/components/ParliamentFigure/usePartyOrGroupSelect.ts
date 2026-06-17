import { useCallback, useMemo, useReducer, useState } from "react";

type State = {
  selectedAlliance: string,
  selectedParty: string
};

const initialState = {
  selectedAlliance: '',
  selectedParty: ''
} satisfies State;

const reducer = (state: State, action: { type: 'reset' | 'set_party' | 'set_alliance', payload?: string}): State => {
  switch (action.type) {
    case 'reset':
      return {
        ...initialState
      };
    case 'set_alliance': 
      return {
        ...state,
        // Clicking again causes reset too.
        selectedParty: '',
        selectedAlliance: state.selectedAlliance === action.payload ? '' : action.payload ?? ''
      };
    case 'set_party': {
      return {
        ...state,
        selectedAlliance: '',
        selectedParty: state.selectedParty === action.payload ? '' : action.payload ?? ''
      };
    }
  }
};

/**
 * Control what is to set and the state of which group or party is selected
 */
export const usePartyOrGroupSelect = (): {
  onPartyOrGroupSelect: (type: 'alliance' | 'party', partyOrGroupName: string) => void,
  rootProps: Record<never, never> | { "data-focused-alliance": string } | {"data-focused-party": string }
  selectedParty: string,
  selectedAlliance: string
} => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onPartyOrGroupSelect = useCallback((type: 'alliance' | 'party', partyOrGroupName: string) => {
    if (!partyOrGroupName) {
      dispatch({ type: 'reset' });
    } else if (type === 'alliance') {
      dispatch({ type: 'set_alliance', payload: partyOrGroupName });
    } else if (type === 'party') {
      dispatch({ type: 'set_party', payload: partyOrGroupName});
    }
  }, [
    dispatch
  ]);

  const rootProps = useMemo(() => {
    if (state.selectedAlliance) {
      return {
        'data-focused-alliance': state.selectedAlliance
      };
    } else if (state.selectedParty) {
      return {
        'data-focused-party': state.selectedParty
      };
    }
    return {};
  }, [state]);

  return {
    onPartyOrGroupSelect,
    rootProps,
    ...state
  };
};
