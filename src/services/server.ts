// utils/serverApi.ts
import axios, { AxiosRequestConfig } from "axios"
import { cookies } from "next/headers"
import type { NextApiRequest } from "next"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

interface ServerConfig {
  req?: NextRequest | NextApiRequest
  withSession?: boolean
}

const createService =
  (baseUrl: string | undefined = "/") =>
  async (
    payload: AxiosRequestConfig,
    { withSession = true, req }: ServerConfig
  ) => {
    let session = null

    if (withSession && req) {
      session = await getToken({ req })
    }

    const cookieStore = cookies()
    const userAgent = (await cookieStore).get("user-agent")?.value || ""
    const ip = (await cookieStore).get("x-forwarded-for")?.value || ""

    try {
      const config = {
        ...payload,
        baseURL: baseUrl,
        headers: {
          ...payload.headers,
          "User-Agent": userAgent,
          "X-Forwarded-For": ip,

          ...(withSession && session
            ? {
                Authorization: `Bearer ${session.access_token}`,
                Cookie: `simpp=${session.refresh_token}`,
              }
            : {}),
        },
      }

      const response = await axios(config)

      if (response && !response?.data?.error) {
        return response.data
      }

      return Promise.reject(JSON.stringify(response.data.data))
    } catch (error: any) {
      return Promise.reject({
        message:
          typeof error?.response?.data === "string"
            ? error?.response?.data
            : (error?.response?.data?.meta?.message ?? "Unknown error"),
        status: error?.response?.status ?? 500,
        code: error?.response?.status ?? 500,
        data: error?.response?.data?.data ?? {},
      })
    }
  }

const serverApi = createService()

export default serverApi
