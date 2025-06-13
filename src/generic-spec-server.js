import { McpServer }            from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path   from 'node:path';
import url    from 'node:url';

/* normalise any return value to proper MCP result -------------------- */
const asResult = (v) =>
  v && typeof v === 'object' && Array.isArray(v.content)
    ? v
    : { content: [{ type: 'text', text: String(v) }] };

/* pluck Zod-shape or keep JSON-Schema wrapper ------------------------ */
const extractShape = (p) => (p?.vendor ? p.schema : p);

/* ──────────────────────── core class ─────────────────────────────── */
export class SpecServer {
  constructor(spec) {
    if (!spec || !Array.isArray(spec.tools))
      throw new Error('spec must have a tools[] array');

    this._spec   = spec;
    this._server = new McpServer({
      name       : spec.id       ?? 'generic-mcp',
      version    : spec.version  ?? '0.0.0',
      description: spec.description,
    });

    /* register every tool */
    for (const t of spec.tools) {
      this._server.tool(
        t.name,
        t.description ?? '',
        extractShape(t.parameters),
        async (args) => {
          try        { return asResult(await t.execute(args)); }
          catch (e)  { return { isError:true,
                                content:[{ type:'text', text:String(e) }] }; }
        },
      );
    }
  }

  /** start the MCP on stdio */
  async start() {
    await this._server.connect(new StdioServerTransport());
    console.error(`✓ SpecServer "${this._spec.id ?? 'generic'}" running on stdio`);
  }
}

/* ─────────────────────── CLI entry point ─────────────────────────── */
if (url.fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2]) {
  const modPath = path.resolve(process.argv[2]);
  const mod     = await import(url.pathToFileURL(modPath).href);
  const spec    = mod.default || mod.spec || mod;
  await new SpecServer(spec).start();
}