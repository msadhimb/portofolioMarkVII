import * as yup from "yup"

export const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .trim(),
  password: yup.string().required("Password is required"),
})

export type ILogin = yup.InferType<typeof schemaLogin>
