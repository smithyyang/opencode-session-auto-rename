# opencode-session-auto-rename

Auto-rename your OpenCode sessions with AI-generated titles after a configurable number of messages.

## Install

### Local plugin (recommended)

Copy or symlink `src/index.ts` to `~/.config/opencode/plugins/session-auto-rename.ts`

```bash
mkdir -p ~/.config/opencode/plugins
cp src/index.ts ~/.config/opencode/plugins/session-auto-rename.ts
```

### npm

```json
{
  "plugin": ["opencode-session-auto-rename"]
}
```

## Configuration

Create `~/.config/opencode/session-auto-rename.jsonc`:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/smithyyang/opencode-session-auto-rename/main/config.schema.json",
  "interval": 5,
  "titleMaxLength": 25,
  "dateFormat": "YY-MM-DD",
  "model": "opencode/grok-code",
  "debug": false
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `interval` | `10` | Rename every N messages |
| `titleMaxLength` | `30` | Max title characters |
| `dateFormat` | `YY-MM-DD` | Timestamp suffix format |
| `model` | `opencode/grok-code` | AI model for title generation |
| `debug` | `false` | Enable debug logs |

## How it works

Hooks into `chat.message` event. After every N AI responses, generates a new session title from the conversation summary and updates it via `client.session.update()`.

## License

MIT
