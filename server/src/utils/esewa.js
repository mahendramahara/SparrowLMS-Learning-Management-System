const crypto = require('crypto');
const axios = require('axios');

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_STATUS_CHECK_URL =
  process.env.ESEWA_STATUS_CHECK_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/';

const generateEsewaSignature = (message, secret = ESEWA_SECRET_KEY) => {
  return crypto.createHmac('sha256', secret).update(message).digest('base64');
};

const initiateEsewaPayment = ({ amount, transactionUuid, successUrl, failureUrl }) => {
  const roundedAmount = Number(amount).toFixed(0);
  const taxAmount = '0';
  const serviceCharge = '0';
  const deliveryCharge = '0';
  const totalAmount = roundedAmount;

  const signatureData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
  const signature = generateEsewaSignature(signatureData);

  return {
    paymentUrl: ESEWA_PAYMENT_URL,
    formData: {
      amount: roundedAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: serviceCharge,
      product_delivery_charge: deliveryCharge,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    },
  };
};

const verifyEsewaSignature = decodedData => {
  const signedFieldNames = decodedData.signed_field_names;
  if (!signedFieldNames || !decodedData.signature) return false;

  const fieldKeys = signedFieldNames.split(',');
  const parts = fieldKeys.map(key => `${key}=${decodedData[key] !== undefined ? decodedData[key] : ''}`);
  const message = parts.join(',');

  const expectedSignature = generateEsewaSignature(message);
  return expectedSignature === decodedData.signature;
};

const checkEsewaStatus = async ({ productCode = ESEWA_PRODUCT_CODE, totalAmount, transactionUuid }) => {
  try {
    const url = `${ESEWA_STATUS_CHECK_URL}?product_code=${encodeURIComponent(
      productCode
    )}&total_amount=${encodeURIComponent(totalAmount)}&transaction_uuid=${encodeURIComponent(
      transactionUuid
    )}`;
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (err) {
    return {
      status: 'NOT_FOUND',
      error: err.message,
    };
  }
};

module.exports = {
  ESEWA_PRODUCT_CODE,
  ESEWA_PAYMENT_URL,
  generateEsewaSignature,
  initiateEsewaPayment,
  verifyEsewaSignature,
  checkEsewaStatus,
};
