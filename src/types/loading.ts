export interface LoadingStates {
  match: boolean;
  odds: boolean;
  h2h: boolean;
}

export interface ErrorStates {
  match: string | null;
  odds: string | null;
  h2h: string | null;
}

export const initialLoadingState: LoadingStates = {
  match: true,
  odds: true,
  h2h: true
};

export const initialErrorState: ErrorStates = {
  match: null,
  odds: null,
  h2h: null
};
