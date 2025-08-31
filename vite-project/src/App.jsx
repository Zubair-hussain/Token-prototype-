// src/App.jsx
import React, { useState } from "react";

export default function App() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [token, setToken] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4242";

  const handlePayment = async () => {
    try {
      const res = await fetch(`${backendURL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Payment request failed");
      const data = await res.json();

      // Assume backend generates a token for wallet pass after payment success
      setPaymentStatus("success");
      setToken(data.token || "sample-token"); // Adjust if your backend returns token
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentStatus("error");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Treat It - Wallet Pass Prototype</h1>

      {!paymentStatus && (
        <>
          <p>Click the button to pay & generate wallet pass token:</p>
          <button onClick={handlePayment}>Pay & Generate Pass</button>
        </>
      )}

      {paymentStatus === "success" && (
        <>
          <p>Payment successful! Your pass token is:</p>
          <code>{token}</code>

          <div style={{ marginTop: 20 }}>
            <a href={`${backendURL}/add-apple-pass/${token}`} style={{ marginRight: 10 }}>
              Add to Apple Wallet
            </a>
            <a href={`${backendURL}/add-google-pass/${token}`}>
              Add to Google Wallet
            </a>
          </div>

          <div style={{ marginTop: 40 }}>
            <h3>Verify your pass:</h3>
            <Verification backendURL={backendURL} />
          </div>
        </>
      )}

      {paymentStatus === "error" && (
        <p style={{ color: "red" }}>Payment failed. Please try again.</p>
      )}
    </div>
  );
}

function Verification({ backendURL }) {
  const [inputToken, setInputToken] = React.useState("");
  const [verification, setVerification] = React.useState(null);

  const handleVerify = async () => {
    try {
      const res = await fetch(`${backendURL}/api/verify/${inputToken}`);
      if (!res.ok) throw new Error("Verification failed");
      const data = await res.json();
      setVerification(data);
    } catch (err) {
      console.error("Verification error:", err);
      setVerification({ status: "error", message: err.message });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter pass token"
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>

      {verification && (
        <div style={{ marginTop: 10 }}>
          {verification.status === "error" ? (
            <p style={{ color: "red" }}>{verification.message}</p>
          ) : (
            <>
              <p>Status: {verification.status}</p>
              <p>Patient: {verification.patient}</p>
              <p>Doctor: {verification.doctor}</p>
              <p>Expires: {verification.expires}</p>
              <p>Disclaimer: {verification.disclaimer}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
