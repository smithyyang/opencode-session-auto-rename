# opencode-session-auto-rename

Auto-rename OpenCode sessions with AI-generated titles after every N messages. Works out of the box with zero config.

## Install

Add to `opencode.json`:

```json
{
  "plugin": ["opencode-session-auto-rename"]
}
```

Restart OpenCode. Done.

## Configuration (optional)

The plugin works with sensible defaults. To customize, create `~/.config/opencode/session-auto-rename.jsonc`:

```jsonc
{
  "interval": 5,
  "titleMaxLength": 25,
  "dateFormat": "YY-MM-DD",
  "model": "opencode/grok-code",
  "debug": false
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `interval` | `10` | Rename every N AI responses |
| `titleMaxLength` | `30` | Max title characters |
| `dateFormat` | `YY-MM-DD` | Timestamp suffix (YYYY/YY/MM/DD/HH/mm) |
| `model` | `opencode/grok-code` | Model for title generation |
| `debug` | `false` | Enable debug logs |

## How it works

Hooks into `chat.message`. After every N AI responses, generates a descriptive title from the conversation summary and updates the session. Title format: `{title}({date})`.

---

[🇨🇳 中文]

# opencode-session-auto-rename

每 N 次对话后自动用 AI 为 OpenCode session 生成标题。开箱即用，零配置。

## 安装

在 `opencode.json` 中添加一行：

```json
{
  "plugin": ["opencode-session-auto-rename"]
}
```

重启 OpenCode。搞定。

## 可选配置

插件自带合理默认值。如需自定义，创建 `~/.config/opencode/session-auto-rename.jsonc`：

```jsonc
{
  "interval": 5,
  "titleMaxLength": 25,
  "dateFormat": "YY-MM-DD",
  "model": "opencode/grok-code",
  "debug": false
}
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `interval` | `10` | 每 N 次 AI 回复后重命名 |
| `titleMaxLength` | `30` | 标题最大字符数 |
| `dateFormat` | `YY-MM-DD` | 时间戳格式 |
| `model` | `opencode/grok-code` | 生成标题用的模型 |
| `debug` | `false` | 开启调试日志 |

## 原理

监听 `chat.message` 事件。每 N 次 AI 回复后，基于对话摘要生成描述性标题并更新 session。标题格式：`{标题}({日期})`。

## 开源说明

本项目完全使用 OpenCode 开发。

## License

MIT
