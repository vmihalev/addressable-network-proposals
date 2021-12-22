import fs from "fs";
import { loadPartial } from "./files";
import { LexerToken, LexerTokenType, PartialBeginStartKey, PartialBeginEndKey } from "./lexer";

interface PartialConfig {
    file: string;
}

/** Interpret the token to generate the content. */
export function interpret(tokens: LexerToken[]): string {
    let doc = '';
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token.type) {
            case LexerTokenType.PlainText: {
                doc += token.text;
                break;
            }
            case LexerTokenType.PartialEnd: {
                throw new Error("Partial end without Partial Begin");
                break;
            }
            case LexerTokenType.PartialBegin: {
                i++;
                if (i == tokens.length) {
                    throw new Error("Partial Begin without Partial End");
                }
                let nextToken = tokens[i];
                if (nextToken.type == LexerTokenType.PlainText) {
                    i++;
                    if (i == tokens.length) {
                        throw new Error("Partial Begin without Partial End");
                    }
                }
                nextToken = tokens[i];
                if (nextToken.type != LexerTokenType.PartialEnd) {
                    throw new Error("Partial Begin without partial end");
                }
                doc += token.text;
                doc += interpretPartialBeginToken(token);
                doc += nextToken.text;
                break;
            }
        }
    }
    return doc;
}

function interpretPartialBeginToken(token: LexerToken) : string {
    const jsonStr = token.text
                    .slice(PartialBeginStartKey.length)
                    .slice(0, -PartialBeginEndKey.length);
    try {
        const config: PartialConfig = JSON.parse(jsonStr);
        if (!config.hasOwnProperty('file')) {
            throw new Error(`Partial with bad configuration: ${token.text}`)
        }
        const partialContent = loadPartial(config.file);
        return partialContent.toString();
    } catch (e) {
        throw new Error(`Partial with bad configuration: ${token.text} - ${e}`)
    }
}
