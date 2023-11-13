export interface TranslateAPIResponse {
  translatedText: string;
  originalLanguage: string;
}

// Edit for Message Passing
export interface DOMMessage {
  type: string;
  payload?: any;
}

export interface DOMMessageResponse {
  success: boolean;
  response?: any;
}
