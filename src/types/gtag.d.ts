interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string,
    config?: ControlParams | EventParams | ConfigParams | CustomParams
  ) => void;
  dataLayer: any[];
}

interface ControlParams {
  groups?: string | string[];
  send_to?: string | string[];
  event_callback?: () => void;
  event_timeout?: number;
}

interface EventParams {
  checkout_option?: string;
  checkout_step?: number;
  content_id?: string;
  content_type?: string;
  coupon?: string;
  currency?: string;
  description?: string;
  fatal?: boolean;
  items?: any[];
  method?: string;
  number?: string;
  promotions?: any[];
  screen_name?: string;
  search_term?: string;
  shipping?: string | number;
  tax?: string | number;
  transaction_id?: string;
  value?: number;
  event_category?: string;
  event_label?: string;
  non_interaction?: boolean;
  [key: string]: any;
}

interface ConfigParams {
  all_allowed_ad_user_data_signals?: boolean;
  allow_ad_personalization_signals?: boolean;
  allow_google_signals?: boolean;
  cookie_domain?: string;
  cookie_expires?: number;
  cookie_flags?: string;
  cookie_name?: string;
  cookie_path?: string;
  cookie_prefix?: string;
  cookie_update?: boolean;
  page_location?: string;
  page_path?: string;
  page_title?: string;
  send_page_view?: boolean;
  user_id?: string;
  user_properties?: { [key: string]: any };
  [key: string]: any;
}

interface CustomParams {
  [key: string]: any;
}
