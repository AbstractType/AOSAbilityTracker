import React from 'react';
import { Text } from 'react-native';

export interface FormattedTextPart {
  text: string;
  bold: boolean;
  italic?: boolean;
}

/**
 * Parse HTML-style bold text (<b>text</b>) into formatted parts
 */
export function parseHtmlBold(input: string): FormattedTextPart[] {
  const parts: FormattedTextPart[] = [];
  const regex = /<b>(.*?)<\/b>/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Add text before the bold section
    if (match.index > lastIndex) {
      parts.push({
        text: input.slice(lastIndex, match.index),
        bold: false,
      });
    }

    // Add the bold text
    parts.push({
      text: match[1],
      bold: true,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < input.length) {
    parts.push({
      text: input.slice(lastIndex),
      bold: false,
    });
  }

  // If no bold text was found, return the original text as non-bold
  if (parts.length === 0) {
    parts.push({
      text: input,
      bold: false,
    });
  }

  return parts;
}

/**
 * Parse markdown-style bold text (**text**) and italic text (*text*) into formatted parts
 */
export function parseMarkdownBold(input: string): FormattedTextPart[] {
  const parts: FormattedTextPart[] = [];
  // Match **bold** OR *italic* (bold takes precedence due to alternation order)
  const regex = /\*\*([^\*]+?)\*\*|\*([^\*\n]+?)\*/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Add text before the matched section
    if (match.index > lastIndex) {
      parts.push({
        text: input.slice(lastIndex, match.index),
        bold: false,
      });
    }

    if (match[1] !== undefined) {
      // Matched **bold**
      parts.push({
        text: match[1],
        bold: true,
      });
    } else if (match[2] !== undefined) {
      // Matched *italic*
      parts.push({
        text: match[2],
        bold: false,
        italic: true,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < input.length) {
    parts.push({
      text: input.slice(lastIndex),
      bold: false,
    });
  }

  // If no formatted text was found, return the original text as non-bold
  if (parts.length === 0) {
    parts.push({
      text: input,
      bold: false,
    });
  }

  return parts;
}

/**
 * Parse bold text in either HTML or markdown format, detecting automatically
 */
export function parseBold(input: string): FormattedTextPart[] {
  // Strip out ^^ markers (used as additional emphasis markers in some BattleScribe JSON)
  // ^^**text**^^ becomes **text**
  let cleanedInput = input.replace(/\^\^/g, '');

  // Try HTML tags first
  if (/<b>/.test(cleanedInput)) {
    return parseHtmlBold(cleanedInput);
  }

  // Fall back to markdown
  return parseMarkdownBold(cleanedInput);
}

/**
 * Render formatted text parts inline within a single Text component
 */
export function renderFormattedText(
  input: string,
  normalStyle: any,
  boldStyle: any
): React.ReactElement {
  const parts = parseMarkdownBold(input);

  return React.createElement(
    Text,
    { style: normalStyle },
    parts
      .filter(part => part.text.length > 0)
      .map((part, index) =>
        part.bold
          ? React.createElement(Text, { key: index, style: boldStyle }, part.text)
          : part.text
      )
  );
}
