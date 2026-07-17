import { createContext, useReducer, useCallback } from 'react';

export const CampaignContext = createContext(null);

const initialState = {
  parsedData: null,
  columns: [],
  mapping: { phone: '', name: '', event: '', qr: '', date: '' },
  template: 'tpl1',
  batchSize: 10,
  waitValue: 5,
  waitUnit: 'minutes',
  scheduleTime: '',
  isRunning: false,
  progress: 0,
  status: '',
  failedRecipients: [],
  editingCampaignId: null,
};

function campaignReducer(state, action) {
  switch (action.type) {
    case 'SET_PARSED_DATA':
      return { ...state, parsedData: action.payload.data, columns: action.payload.columns, editingCampaignId: null };
    case 'SET_MAPPING':
      return { ...state, mapping: { ...state.mapping, ...action.payload } };
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'SET_BATCH_SETTINGS':
      return { ...state, batchSize: action.payload.batchSize, waitValue: action.payload.waitValue, waitUnit: action.payload.waitUnit };
    case 'SET_SCHEDULE':
      return { ...state, scheduleTime: action.payload };
    case 'START_SENDING':
      return { ...state, isRunning: true, progress: 0, status: 'Starting...' };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: action.payload.progress, status: action.payload.status };
    case 'FINISH_SENDING':
      return { ...state, isRunning: false, progress: 100, status: 'Campaign complete!' };
    case 'SET_FAILED_RECIPIENTS':
      return { ...state, failedRecipients: action.payload };
    case 'LOAD_CAMPAIGN':
      return {
        ...state,
        ...action.payload,
        editingCampaignId: action.payload.id,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const CampaignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  const setParsedData = useCallback((data, columns) => {
    dispatch({ type: 'SET_PARSED_DATA', payload: { data, columns } });
  }, []);

  const setMapping = useCallback((field, value) => {
    dispatch({ type: 'SET_MAPPING', payload: { [field]: value } });
  }, []);

  const setTemplate = useCallback((template) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, []);

  const setBatchSettings = useCallback((settings) => {
    dispatch({ type: 'SET_BATCH_SETTINGS', payload: settings });
  }, []);

  const setSchedule = useCallback((time) => {
    dispatch({ type: 'SET_SCHEDULE', payload: time });
  }, []);

  const startSending = useCallback(() => {
    dispatch({ type: 'START_SENDING' });
  }, []);

  const updateProgress = useCallback((progress, status) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { progress, status } });
  }, []);

  const finishSending = useCallback(() => {
    dispatch({ type: 'FINISH_SENDING' });
  }, []);

  const setFailedRecipients = useCallback((list) => {
    dispatch({ type: 'SET_FAILED_RECIPIENTS', payload: list });
  }, []);

  const loadCampaign = useCallback((campaignData) => {
    dispatch({ type: 'LOAD_CAMPAIGN', payload: campaignData });
  }, []);

  const resetCampaign = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = {
    ...state,
    setParsedData,
    setMapping,
    setTemplate,
    setBatchSettings,
    setSchedule,
    startSending,
    updateProgress,
    finishSending,
    setFailedRecipients,
    loadCampaign,
    resetCampaign,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};