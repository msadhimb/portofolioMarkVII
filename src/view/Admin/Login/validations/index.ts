import * as yup from "yup"

export const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi")
    .trim(),
  password: yup.string().required("Kata sandi wajib diisi"),
})

export type ILogin = yup.InferType<typeof schemaLogin>
