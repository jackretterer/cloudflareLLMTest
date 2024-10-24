# My Next.js App

This is a Next.js project integrated with Cloudflare Pages, utilizing AI capabilities for transcription and response generation.

## Getting Started

To start the development server, use:

```bash
pnpm dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser.

## Cloudflare Integration

This project includes scripts for Cloudflare Pages integration:

- **Build for Pages**: `pnpm pages:build`
- **Preview Locally**: `pnpm preview`
- **Deploy**: `pnpm deploy`

### Bindings

Cloudflare Bindings allow interaction with Cloudflare resources. Configure them in `next.config.js` for development, in the `wrangler.toml` for preview, and in the Cloudflare dashboard for deployment.

### KV Example

To enable the KV example:

1. Uncomment lines with `// KV Example:` in your code and `wrangler.toml`.
2. Run `pnpm cf-typegen` to update TypeScript types.
3. Visit `/api/hello` to see the example in action.

## Scripts

- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Start**: `pnpm start`
- **Lint**: `pnpm lint`

## Dependencies

- **React**: ^18
- **Next.js**: 14.2.5
- **Shadcn UI**: ^0.9.2
- **Tailwind CSS**: ^3.4.1

## Dev Dependencies

- **TypeScript**: ^5
- **ESLint**: ^8
- **Wrangler**: ^3.82.0

## AI Integration

This app uses AI for transcription and response generation via Cloudflare's bindings. Ensure your environment is configured with the necessary AI bindings.

## License

This project is licensed under the MIT License.
