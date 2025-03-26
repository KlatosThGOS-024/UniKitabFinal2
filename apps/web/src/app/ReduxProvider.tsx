"use client";
import { Provider } from "react-redux";
import React from "react";
import { store } from "@/store/store";
interface childrenProp {
  children: React.ReactNode;
}

const ReduxProvider = ({ children }: childrenProp) => {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};
export default ReduxProvider;
