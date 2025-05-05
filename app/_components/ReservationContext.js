"use client";
import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();
function ReservationContextProvider({ children }) {
  const initialState = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialState);
  function resetRange() {
    setRange(initialState);
  }

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}
function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error(
      "Reservation context was used outside the scope of the Context Provider"
    );

  return context;
}

export { ReservationContextProvider, useReservation };
