/**
 * Réponses normalisées des endpoints SoftPay (doc PayDunya).
 * @see https://developers.paydunya.com/doc/FR/softpay
 */
export type PaydunyaSoftPayResponse = {
  success: boolean;
  message?: string;
  url?: string;
  other_url?: { om_url?: string; maxit_url?: string };
  fees?: number;
  currency?: string;
  data?: unknown;
  errors?: unknown;
  return_url?: string;
  token?: string;
};

/* --- Requêtes par opérateur (champs alignés sur la doc officielle) --- */

export type SoftPayCardInput = {
  full_name: string;
  email: string;
  card_number: string;
  card_cvv: string;
  card_expired_date_year: string;
  card_expired_date_month: string;
  token: string;
};

export type SoftPayOrangeMoneySenegalInput = {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  invoice_token: string;
};

export type SoftPayFreeMoneySenegalInput = {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  payment_token: string;
};

export type SoftPayExpressoSenegalInput = {
  expresso_sn_fullName: string;
  expresso_sn_email: string;
  expresso_sn_phone: string;
  payment_token: string;
};

export type SoftPayWaveSenegalInput = {
  wave_senegal_fullName: string;
  wave_senegal_email: string;
  wave_senegal_phone: string;
  wave_senegal_payment_token: string;
};

export type SoftPayWizallSenegalInput = {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  invoice_token: string;
};

export type SoftPayWizallSenegalConfirmInput = {
  authorization_code: string;
  phone_number: string;
  transaction_id: string;
};

export type SoftPayOrangeMoneyCiInput = {
  orange_money_ci_customer_fullname: string;
  orange_money_ci_email: string;
  orange_money_ci_phone_number: string;
  orange_money_ci_otp: string;
  payment_token: string;
};

export type SoftPayMtnCiInput = {
  mtn_ci_customer_fullname: string;
  mtn_ci_email: string;
  mtn_ci_phone_number: string;
  mtn_ci_wallet_provider: string;
  payment_token: string;
};

export type SoftPayMoovCiInput = {
  moov_ci_customer_fullname: string;
  moov_ci_email: string;
  moov_ci_phone_number: string;
  payment_token: string;
};

export type SoftPayWaveCiInput = {
  wave_ci_fullName: string;
  wave_ci_email: string;
  wave_ci_phone: string;
  wave_ci_payment_token: string;
};

export type SoftPayOrangeMoneyBurkinaInput = {
  name_bf: string;
  email_bf: string;
  phone_bf: string;
  otp_code: string;
  payment_token: string;
};

export type SoftPayMoovBurkinaInput = {
  moov_burkina_faso_fullName: string;
  moov_burkina_faso_email: string;
  moov_burkina_faso_phone_number: string;
  moov_burkina_faso_payment_token: string;
};

export type SoftPayMoovBeninInput = {
  moov_benin_customer_fullname: string;
  moov_benin_email: string;
  moov_benin_phone_number: string;
  payment_token: string;
};

export type SoftPayMtnBeninInput = {
  mtn_benin_customer_fullname: string;
  mtn_benin_email: string;
  mtn_benin_phone_number: string;
  mtn_benin_wallet_provider: string;
  payment_token: string;
};

export type SoftPayTMoneyTogoInput = {
  name_t_money: string;
  email_t_money: string;
  phone_t_money: string;
  payment_token: string;
};

export type SoftPayMoovTogoInput = {
  moov_togo_customer_fullname: string;
  moov_togo_email: string;
  moov_togo_customer_address: string;
  moov_togo_phone_number: string;
  payment_token: string;
};

export type SoftPayOrangeMoneyMaliInput = {
  orange_money_mali_customer_fullname: string;
  orange_money_mali_email: string;
  orange_money_mali_phone_number: string;
  orange_money_mali_customer_address: string;
  payment_token: string;
};

export type SoftPayMoovMaliInput = {
  moov_ml_customer_fullname: string;
  moov_ml_email: string;
  moov_ml_phone_number: string;
  moov_ml_customer_address: string;
  payment_token: string;
};

export type SoftPayMtnCamerounInput = {
  mtn_cameroun_customer_fullname: string;
  mtn_cameroun_email: string;
  mtn_cameroun_phone_number: string;
  mtn_cameroun_wallet_provider: string;
  payment_token: string;
};

/** Doc PayDunya : champ `phone_phone` */
export type SoftPayPaydunyaWalletInput = {
  customer_name: string;
  customer_email: string;
  phone_phone: string;
  password: string;
  invoice_token: string;
};
