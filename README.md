# opencode-session-auto-rename

[中文](./README.zh.md)

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

## License

MIT
