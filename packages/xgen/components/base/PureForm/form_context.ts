import { FormInstance } from "antd";
import { createContext, useContext } from "react";

// @ts-ignore Avoid duplicate declarations
export const FormContext = createContext<FormInstance>()

export const useForm = () => useContext(FormContext)