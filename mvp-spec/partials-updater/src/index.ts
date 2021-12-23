import { listDocuments, rewriteDocument, loadDocument } from "./files";
import { lex } from "./lexer"; 
import { interpret } from "./interpretor"

async function update() {
    const docs = listDocuments();
    for (const doc of docs) {
        const content = loadDocument(doc)
        const tokens = lex(content);
        const processedContent = await interpret(tokens);
        if (processedContent != content) {
            rewriteDocument(doc, processedContent);
            console.log(`Document updated: ${doc}`);
        }
    }
}

(async () => {
    try {
        await update();
    } catch (error) {
        console.error(error);
    }
})();