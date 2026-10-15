"use client"

import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { getSession, signOut } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"

const CancelToken = axios.CancelToken
let cancel: any = undefined

const axiosInterceptorInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}/api`,
  timeout: 1000000,
})

const onFulfilled = (response: AxiosResponse) => Promise.resolve(response)

const onRejected = async (error: any) => {
  const originalRequest = error.config

  if (error.response?.status === 401) {
    // Gunakan property pada originalRequest untuk tracking retry
    if (!originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Coba refresh session atau token
        const session = await getSession()
        if (session) {
          // Jika session masih ada, coba request lagi
          return axiosInterceptorInstance(originalRequest)
        } else {
          // Jika tidak ada session, langsung logout
          throw new Error("No session found")
        }
      } catch (refreshError) {
        // Jika refresh gagal, logout
        signOut()
        return Promise.reject(error)
      }
    } else {
      // Jika sudah pernah retry (kedua kali 401), langsung logout
      signOut()
      return Promise.reject(error)
    }
  } else if (error.response?.status === 403) {
    window.location.href = "/admin/profil"
  } else if (error.response?.status === 503) {
    window.location.href = "/503"
  }

  return Promise.reject(error)
}

axiosInterceptorInstance.interceptors.response.use(onFulfilled, onRejected)

const clientApi = async (payload: AxiosRequestConfig) => {
  payload.timeout = 120000

  try {
    const response = await axiosInterceptorInstance({
      withCredentials: false,
      ...payload,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c
      }),
    })

    if (response && response.data) {
      return response.data
    }

    return Promise.reject(JSON.stringify(response.data.data))
  } catch (error: any) {
    return Promise.reject({
      message: error?.response?.data?.message ?? "",
      status: error?.response?.status ?? "",
      code: error?.response?.status ?? 500,
      data: error?.response?.data?.data ?? {},
    })
  }
}

export async function fetchDocument(
  endpoint: string,
  filename: string,
  setDocumentFile: Dispatch<SetStateAction<File[]>>
) {
  try {
    const response = await fetch(endpoint + filename)
    const blob = await response.blob()
    const file = new File([blob], filename, { type: blob.type })
    setDocumentFile([file])
  } catch (error) {
    console.error("Error fetching document:", error)
  }
}

export default clientApi
