/** Reads a streamed text response, calling onChunk with the full text so far. */
export async function readTextStream(response: Response, onChunk: (text: string) => void): Promise<string> {
    if (!response.body) throw new Error("No response body")
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let text = ""

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        onChunk(text)
    }
    text += decoder.decode()
    onChunk(text)
    return text
}
