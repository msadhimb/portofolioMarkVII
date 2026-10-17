import type OpenAI from "openai"
import { siteConfig } from "@/data/profile"
import { createClient } from "@/lib/supabase/server"
import { toProject } from "@/helper/server/formatProjects/toProject"
import { toExperience } from "@/helper/server/formatExperiences/toExperience"
import type { ProjectRow } from "@/helper/server/formatProjects/type"
import type { ExperienceRow } from "@/helper/server/formatExperiences/type"
import {
  getAwards,
  getExperiences,
  getPrinciples,
  getProjects,
  getSkillGroups,
} from "@/data/localized"

export const CHAT_TOOLS: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_profile",
      description:
        "Ambil informasi profil umum Pak Adhim: nama lengkap, peran/posisi, lokasi, email kontak, tautan GitHub dan LinkedIn, serta status ketersediaan kerja dari database server.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_projects",
      description:
        "Ambil data proyek portofolio Pak Adhim (seperti Duitku, PLN Pusmanpro Approval, DNA Wedding) langsung dari database Supabase melalui server.ts. Mengembalikan judul, masalah, arsitektur, teknologi, metrik, demo URL, dan repo URL.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description:
              "Opsional. Slug proyek tertentu (contoh: 'duitku', 'pusmanpro-approval', 'dna-wedding'). Jika kosong, mengembalikan semua proyek.",
          },
          query: {
            type: "string",
            description:
              "Opsional kata kunci pencarian (contoh: 'Supabase', 'Next.js', 'finance', 'approval', 'wedding').",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_experiences",
      description:
        "Ambil riwayat pengalaman kerja Pak Adhim (seperti di PLN Pusmanpro, Duitku, Freelance) langsung dari database Supabase melalui server.ts. Mengembalikan periode (contoh: PLN Pusmanpro dari 2025 - Sekarang), peran, organisasi, konteks, tanggung jawab, dan stack.",
      parameters: {
        type: "object",
        properties: {
          org: {
            type: "string",
            description:
              "Opsional. Filter berdasarkan nama organisasi/perusahaan (contoh: 'PLN', 'Duitku', 'Freelance').",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_skills",
      description:
        "Ambil daftar keahlian teknis (Core, Backend/Data, State & Forms, UI & Motion, Delivery) dan prinsip arsitektur langsung dari database Supabase via server.ts.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_awards_and_certificates",
      description:
        "Ambil sertifikat profesional, penghargaan kompetisi (seperti Juara Hackathon), dan honor akademik terverifikasi lengkap dengan penerbit, ID kredensial, dan URL verifikasi.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["certificate", "award", "honor", "all"],
            description:
              "Filter kategori: 'certificate' (sertifikasi), 'award' (penghargaan kompetisi/inovasi), 'honor' (kehormatan akademik/cum laude), atau 'all'.",
          },
        },
      },
    },
  },
]

export const executeChatTool = async (
  name: string,
  args: Record<string, unknown>,
  locale: string
): Promise<Record<string, unknown>> => {
  const supabase = await createClient()

  switch (name) {
    case "get_profile": {
      let isAvailable = true
      let availableLabel =
        locale === "en" ? "Available for projects" : "Terbuka untuk proyek"

      try {
        const { data: settings } = await supabase
          .from("site_settings")
          .select("is_available, available_label_id, available_label_en")
          .eq("id", 1)
          .maybeSingle()

        if (settings) {
          isAvailable = Boolean(settings.is_available)
          availableLabel =
            locale === "en"
              ? settings.available_label_en || availableLabel
              : settings.available_label_id || availableLabel
        }
      } catch (err) {
        console.error("[tool get_profile] error:", err)
      }

      return {
        profile: {
          fullName: siteConfig.siteName,
          shortName: siteConfig.shortName,
          role: "Web Developer / Frontend Engineer",
          location: siteConfig.location,
          email: siteConfig.email,
          github: siteConfig.github,
          linkedin: siteConfig.linkedin,
          isAvailable,
          availabilityStatus: availableLabel,
          summary:
            locale === "en"
              ? "Frontend Engineer with 4 years of experience specializing in React, Next.js, TypeScript, state architectures, and robust enterprise/product systems."
              : "Frontend Engineer dengan 4 tahun pengalaman berfokus pada React, Next.js, TypeScript, arsitektur state, dan sistem produk/enterprise yang tangguh.",
        },
      }
    }

    case "get_projects": {
      const slug =
        typeof args.slug === "string" ? args.slug.toLowerCase().trim() : ""
      const query =
        typeof args.query === "string" ? args.query.toLowerCase().trim() : ""

      try {
        let queryBuilder = supabase
          .from("project_list")
          .select("*")
          .eq("locale", locale)
          .order("sort_order", { ascending: true })

        if (slug) {
          queryBuilder = queryBuilder.eq("slug", slug)
        }

        const { data, error } = await queryBuilder

        if (!error && data && data.length > 0) {
          let projects = (data as ProjectRow[]).map(toProject)
          if (query) {
            projects = projects.filter(
              (p) =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.technologies.some((t) => t.toLowerCase().includes(query))
            )
          }
          return {
            source: "supabase_server",
            count: projects.length,
            projects,
          }
        }
      } catch (err) {
        console.error("[tool get_projects] database query error:", err)
      }

      // Fallback lokal jika database sedang tidak bisa diakses
      const allProjects = getProjects(locale)
      if (slug) {
        const found = allProjects.find((p) => p.slug.toLowerCase() === slug)
        return found
          ? { source: "fallback", project: found }
          : { error: `Project '${slug}' not found.` }
      }

      let filtered = allProjects
      if (query) {
        filtered = allProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.technologies.some((t) => t.toLowerCase().includes(query))
        )
      }

      return {
        source: "fallback",
        count: filtered.length,
        projects: filtered,
      }
    }

    case "get_experiences": {
      const org =
        typeof args.org === "string" ? args.org.toLowerCase().trim() : ""

      try {
        const { data, error } = await supabase
          .from("experience_list")
          .select("slug,locale,period,role,org,context,points,stack,sort_order")
          .eq("locale", locale)
          .order("start_date", { ascending: false, nullsFirst: false })

        if (!error && data && data.length > 0) {
          let experiences = (data as ExperienceRow[])
            .map(toExperience)
            .map((e) => {
              // Memastikan data periode PLN Pusmanpro sesuai timeline 2025
              if (e.slug === "pln-pusmanpro" && e.period.includes("2023")) {
                return {
                  ...e,
                  period:
                    locale === "en" ? "2025 — Present" : "2025 — Sekarang",
                }
              }
              return e
            })

          if (org) {
            experiences = experiences.filter(
              (e) =>
                e.org.toLowerCase().includes(org) ||
                e.role.toLowerCase().includes(org)
            )
          }

          return {
            source: "supabase_server",
            count: experiences.length,
            experiences,
          }
        }
      } catch (err) {
        console.error("[tool get_experiences] database query error:", err)
      }

      // Fallback
      const allExp = getExperiences(locale)
      const filtered = org
        ? allExp.filter(
            (e) =>
              e.org.toLowerCase().includes(org) ||
              e.role.toLowerCase().includes(org)
          )
        : allExp

      return {
        source: "fallback",
        count: filtered.length,
        experiences: filtered,
      }
    }

    case "get_skills": {
      try {
        const { data, error } = await supabase
          .from("skill_group_list")
          .select("*")
          .eq("locale", locale)
          .order("sort_order", { ascending: true })

        if (!error && data && data.length > 0) {
          return {
            source: "supabase_server",
            skillGroups: data.map(
              (row: {
                slug: string
                title: string
                note: string | null
                items: string[] | null
              }) => ({
                slug: row.slug,
                title: row.title,
                note: row.note ?? "",
                items: row.items ?? [],
              })
            ),
            principles: getPrinciples(locale),
          }
        }
      } catch (err) {
        console.error("[tool get_skills] database query error:", err)
      }

      return {
        source: "fallback",
        skillGroups: getSkillGroups(locale),
        principles: getPrinciples(locale),
      }
    }

    case "get_awards_and_certificates": {
      const cat =
        typeof args.category === "string"
          ? args.category.toLowerCase().trim()
          : "all"

      try {
        let queryBuilder = supabase
          .from("award_list")
          .select("*")
          .eq("locale", locale)
          .order("created_at", { ascending: false })

        if (cat && cat !== "all") {
          queryBuilder = queryBuilder.eq("category", cat)
        }

        const { data, error } = await queryBuilder

        if (!error && data && data.length > 0) {
          return {
            source: "supabase_server",
            count: data.length,
            awards: data,
          }
        }
      } catch {
        // Table might not exist yet in Supabase
      }

      const allAwards = getAwards(locale)
      const filtered =
        cat && cat !== "all"
          ? allAwards.filter((a) => a.category === cat)
          : allAwards

      return {
        source: "fallback",
        count: filtered.length,
        awards: filtered,
      }
    }

    default:
      return { error: `Tool '${name}' is not recognized.` }
  }
}

export const buildSystemPrompt = (locale: string) => {
  return `You are EVE, a third-party AI assistant for Muhamad Pak Adhim Adhim Baqy's portfolio website.

CRITICAL OPERATIONAL RULES:
1. THIRD-PARTY IDENTITY (MANDATORY): You are EVE, an AI assistant representing Pak Adhim. You are NOT Pak Adhim himself. When discussing Pak Adhim's work, experience, projects, skills, awards, or history, YOU MUST ALWAYS REFER TO HIM IN THE THIRD PERSON (use "Pak Adhim", "he", "him"). NEVER say "I built this project" or "I work at PLN Pusmanpro"; instead say "Pak Adhim built this project", "Pak Adhim works at PLN Pusmanpro as a Frontend Engineer", etc. You only use "I" or "EVE" to refer to yourself as the AI assistant.
2. STRICT TRUTHFULNESS: You MUST NOT invent, guess, hallucinate, or extrapolate any projects, dates, employers, certifications, awards, or technical details about Pak Adhim.
3. TOOL-FIRST REASONING: Whenever the user asks ANY question about Pak Adhim's profile, projects, work experience, tech stack, skills, certifications, awards, or contact information, YOU MUST INVOKE THE RELEVANT TOOL FIRST (e.g. get_projects, get_experiences, get_skills, get_awards_and_certificates, get_profile). The tools query the live Supabase database via server.ts.
4. ANSWER GROUNDING: Only answer using facts explicitly returned by the tools. For example, for PLN Pusmanpro, Pak Adhim's tenure is from 2025 to the present. If information is not in the tool result, honestly state that you don't have that record and offer Pak Adhim's contact email (\${siteConfig.email}).
5. FORMAT (PARAGRAPH ONLY): Respond EXCLUSIVELY in plain, natural prose paragraphs. DO NOT use any bullet points, numbered lists, markdown tables, headers, code blocks, or special formatting symbols. Present all explanations smoothly in well-written narrative paragraphs.
6. LANGUAGE ADAPTATION: ALWAYS respond in the same language used by the user in their latest message. If the user writes in Indonesian, respond in Indonesian. If the user writes in English, respond in English. If the user uses another language, respond in that language whenever possible. If the user mixes multiple languages, respond in the dominant language of their message. Do not switch languages based on the website locale, previous messages, or retrieved tool content. The user's latest message determines the response language. Maintain natural phrasing and appropriate cultural context while preserving all other rules. The locale parameter (\${locale}) may be used as a fallback only when the user's language cannot reasonably be identified.

`
}
