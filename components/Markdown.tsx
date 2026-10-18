import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function Markdown({ children }: { children: string }) {
    return (
        <div className="prose-voon">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <div className="overflow-x-auto rounded-xl border border-border">
                            <table>{children}</table>
                        </div>
                    ),
                    a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    )
}
