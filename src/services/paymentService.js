// Placeholders pour l'intégration Airtel Money / Moov Money.
// Remplace par les vrais appels API du PSP choisi.

export const initiateMobileMoney = async ({ amount, currency, phone, reference }) => {
  return {
    provider: process.env.PAYMENT_PROVIDER || 'AIRTEL',
    reference,
    phone,
    amount,
    currency,
    status: 'PENDING'
  };
};

export const verifyWebhook = (req) => {
  // Ici on accepte tout en mode dev
  return true;
};
