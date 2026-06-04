import type { ChatMessage as ChatMessageType } from "@/types/app.types";
import { cn } from "@/lib/utils";

// Parses a restricted subset of markup: <b>, <b class="amt">, <span class="amt">.
// Returns safe React nodes — no innerHTML needed.
function parseMarkup(text: string): React.ReactNode[] {
  const TAG_RE = /(<b(?:\s[^>]*)?>.*?<\/b>|<span(?:\s[^>]*)?>.*?<\/span>)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = TAG_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const raw = match[0];
    const boldMatch = raw.match(/^<b(?:\s+class="([^"]*)")?>([\s\S]*)<\/b>$/);
    const spanMatch = raw.match(/^<span(?:\s+class="([^"]*)")?>([\s\S]*)<\/span>$/);

    if (boldMatch) {
      const isAmt = boldMatch[1] === "amt";
      nodes.push(
        <b key={key++} className={isAmt ? "tabular-nums" : undefined}>
          {boldMatch[2]}
        </b>
      );
    } else if (spanMatch) {
      const isAmt = spanMatch[1] === "amt";
      nodes.push(
        <span key={key++} className={isAmt ? "tabular-nums font-bold" : undefined}>
          {spanMatch[2]}
        </span>
      );
    } else {
      nodes.push(raw);
    }

    last = match.index + raw.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  return (
    <div
      className={cn(
        "px-[13px] py-[10px] rounded-[14px] text-[13px] leading-[1.5] max-w-[90%]",
        message.role === "user"
          ? "self-end bg-[var(--primary)] text-white rounded-br-[4px]"
          : "self-start bg-white border border-[var(--line)] rounded-bl-[4px] shadow-[var(--shadow)] text-[var(--ink)]",
        "animate-[msgIn_.2s_ease]"
      )}
      style={{ animationFillMode: "both" }}
    >
      <span
        className={cn(
          "[&_b]:font-bold",
          message.role === "bot" && "[&_b]:text-[var(--primary)] [&_.amt]:tabular-nums [&_.amt]:font-bold"
        )}
      >
        {parseMarkup(message.text)}
      </span>
    </div>
  );
}
