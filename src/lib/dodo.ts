import DodoPayments from "dodopayments";

if (!process.env.DODOPAYMENTS_API_KEY) {
  throw new Error("DODOPAYMENTS_API_KEY is missing from environment variables");
}

export const dodo = new DodoPayments({
  bearerToken: process.env.DODOPAYMENTS_API_KEY,
});

export const getDodoClient = () => dodo;
