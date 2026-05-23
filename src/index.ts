import type { Plugin } from "@opencode-ai/plugin"

const msgCount = new Map<string, number>()

const SYSTEM_PROMPT = `You are a session title generator. Generate a concise, descriptive title for a coding session.

Rules:
- Title must be in the same language as the conversation
- Title should capture the current main task/topic
- Keep it short (max {maxLength} characters)
- No quotes, no punctuation at the end
- Output ONLY the title, nothing else`

const CONFIG_PATH = process.env.HOME + "/.config/opencode/session-auto-rename.jsonc"

function parseModel(s: string) {
  const i = s.indexOf("/")
  if (i === -1) return null
  return { providerID: s.slice(0, i), modelID: s.slice(i + 1) }
}

function fmtDate(fmt: string) {
  const d = new Date()
  const p = (n: number) => n.toString().padStart(2, "0")
  return fmt
    .replace("YYYY", String(d.getFullYear()))
    .replace("YY", String(d.getFullYear()).slice(-2))
    .replace("MM", p(d.getMonth() + 1))
    .replace("DD", p(d.getDate()))
    .replace("HH", p(d.getHours()))
    .replace("mm", p(d.getMinutes()))
}

function defaultConfig() {
  return {
    interval: 10,
    titleMaxLength: 30,
    dateFormat: "YY-MM-DD",
    model: "opencode/grok-code",
    debug: false,
  }
}

async function loadConfig() {
  try {
    const f = Bun.file(CONFIG_PATH)
    if (f.size > 0) {
      const text = await f.text()
      const stripped = text
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(?<![:"'])\/\/.*$/gm, "")
      return { ...defaultConfig(), ...JSON.parse(stripped) }
    }
  } catch {}
  return defaultConfig()
}

export const sessionAutoRename: Plugin = async (ctx) => {
  const cfg = await loadConfig()
  const interval = cfg.interval
  const maxLen = cfg.titleMaxLength
  const dateFmt = cfg.dateFormat
  const modelStr = cfg.model
  const debug = cfg.debug
  const userModel = modelStr ? parseModel(modelStr) : null

  if (debug) console.log("[auto-rename] cfg:", { interval, maxLen, model: modelStr })

  return {
    "chat.message": async (input, output) => {
      const { sessionID } = input
      if (!sessionID) return

      const count = (msgCount.get(sessionID) ?? 0) + 1
      msgCount.set(sessionID, count)

      if (count % interval !== 0) return
      if (debug) console.log("[auto-rename] triggering rename for", sessionID, "msg #", count)

      let text = ""
      if (output.message?.summary?.title) {
        text = output.message.summary.title
      } else if (output.message?.summary?.body) {
        text = output.message.summary.body
      } else {
        const part = output.parts?.find((p: any) => p.type === "text")
        if (part?.text) text = part.text
      }
      if (!text || text.length < 5) return

      setImmediate(async () => {
        try {
          const ts = await ctx.client.session.create({ body: {} })
          if (!ts.data?.id) return
          const tsId = ts.data.id

          let title = ""
          try {
            const promptBody: any = {
              system: SYSTEM_PROMPT.replace("{maxLength}", String(maxLen)),
              parts: [{ type: "text", text: `Current conversation context:\n\n${text.slice(0, 2000)}\n\nGenerate a session title:` }],
            }
            if (userModel) promptBody.model = userModel

            const resp = await ctx.client.session.prompt({ path: { id: tsId }, body: promptBody })
            const tp = resp.data?.parts?.find((p: any) => p.type === "text")
            if (tp?.text) title = tp.text.trim().slice(0, maxLen)
          } finally {
            await ctx.client.session.delete({ path: { id: tsId } }).catch(() => {})
          }

          if (!title) return
          const full = `${title}(${fmtDate(dateFmt)})`
          await ctx.client.session.update({ path: { id: sessionID }, body: { title: full } })
          if (debug) console.log("[auto-rename]", sessionID, "->", full)
        } catch (e) {
          console.error("[auto-rename] error:", e)
        }
      })
    },
  }
}
