import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormattedText from '../atoms/FormattedText';
import Divider from '../atoms/Divider';
import { useResponsive } from '../../utils/responsive';
import { colors } from '../../theme/tokens';

interface AbilityDescriptionProps {
  description: string;
  /** Right-side padding to avoid overlap with corner badges */
  rightPadding?: number;
}

/**
 * AbilityDescription molecule — renders an ability's description text, splitting
 * Used By / Declare / Effect sections with horizontal dividers between them.
 * Handles paragraph normalization, bullet detection, and battle round spacing.
 */
export default function AbilityDescription({
  description,
  rightPadding,
}: AbilityDescriptionProps) {
  const { select } = useResponsive();
  const effectiveRightPadding = rightPadding ?? select({ mobile: 60, default: 80 });

  // Split the description into Used By / Declare / Effect sections (separated by dividers).
  const markers = [
    { label: '**Used By:**', index: description.indexOf('**Used By:**') },
    { label: '**Declare:**', index: description.indexOf('**Declare:**') },
    { label: '**Effect:**', index: description.indexOf('**Effect:**') },
  ]
    .filter(m => m.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (markers.length > 1) {
    const sections: string[] = [];
    if (markers[0].index > 0) {
      const intro = description.substring(0, markers[0].index).trim();
      if (intro) sections.push(intro);
    }
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].index;
      const end = i + 1 < markers.length ? markers[i + 1].index : description.length;
      sections.push(description.substring(start, end).trim());
    }

    return (
      <View>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider rightInset={effectiveRightPadding} />}
            <SectionContent text={section} rightPadding={effectiveRightPadding} />
          </React.Fragment>
        ))}
      </View>
    );
  }

  return <SectionContent text={description} rightPadding={effectiveRightPadding} />;
}

// ============================================================
// Section rendering — blocks of text and bullet groups
// ============================================================

/** Matches lines that start with a bullet character (•, -, *) followed by whitespace. */
const BULLET_LINE = /^[•\-*]\s/;

type Block =
  | { type: 'text'; content: string }
  | { type: 'bullets'; items: string[] };

/**
 * Renders a section's text by parsing it into alternating text-paragraph and bullet-list blocks.
 * Each block gets the appropriate vertical spacing — paragraphs are separated more loosely,
 * bullets are grouped tightly together.
 */
function SectionContent({
  text,
  rightPadding,
}: {
  text: string;
  rightPadding: number;
}) {
  const blocks = parseToBlocks(text);

  return (
    <View>
      {blocks.map((block, index) => {
        const isLast = index === blocks.length - 1;
        if (block.type === 'bullets') {
          return (
            <BulletList
              key={index}
              items={block.items}
              rightPadding={rightPadding}
              isLast={isLast}
            />
          );
        }
        return (
          <FormattedText
            key={index}
            text={block.content}
            style={[styles.paragraph, { paddingRight: rightPadding }, isLast && styles.paragraphLast]}
          />
        );
      })}
    </View>
  );
}

/**
 * Renders a tight, visually distinctive bullet list. Uses a gold triangle bullet
 * for stronger visual hierarchy than a plain dot.
 */
function BulletList({
  items,
  rightPadding,
  isLast,
}: {
  items: string[];
  rightPadding: number;
  isLast: boolean;
}) {
  const { scaleFont, select } = useResponsive();
  const fontSize = scaleFont(select({ mobile: 13, default: 14 }));
  const lineHeight = scaleFont(select({ mobile: 19, default: 21 }));

  return (
    <View style={[styles.bulletList, isLast && styles.bulletListLast, { paddingRight: rightPadding }]}>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletItem}>
          <Text
            style={[
              styles.bullet,
              { fontSize: fontSize + 3, lineHeight },
            ]}
          >
            ▸
          </Text>
          <View style={styles.bulletTextWrapper}>
            <FormattedText text={item} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Splits text into alternating text-paragraph and bullet-list blocks.
 * - Lines that start with •, -, or * become bullet items grouped into one block.
 * - Consecutive non-bullet lines are joined into a paragraph (mid-sentence wraps are smoothed).
 * - Empty lines end the current block.
 * - "Battle Round X:" labels become their own paragraph for visual emphasis.
 */
function parseToBlocks(text: string): Block[] {
  // First, ensure "Battle Round X:" lines are isolated for clarity
  const preprocessed = text.replace(
    /(\n)(\s*)(\*\*)?(Battle Round \d+\+?:)(\*\*)?/g,
    '\n\n$3$4$5'
  );

  const lines = preprocessed.split('\n');
  const blocks: Block[] = [];
  let currentText = '';
  let currentBullets: string[] = [];

  function flushText() {
    if (currentText.trim()) {
      blocks.push({ type: 'text', content: currentText.trim() });
      currentText = '';
    }
  }
  function flushBullets() {
    if (currentBullets.length > 0) {
      blocks.push({ type: 'bullets', items: currentBullets });
      currentBullets = [];
    }
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      // Blank line — close out current block
      flushText();
      flushBullets();
      continue;
    }

    if (BULLET_LINE.test(trimmed)) {
      flushText();
      currentBullets.push(trimmed.replace(BULLET_LINE, '').trim());
      continue;
    }

    // Non-bullet text: bullets are done if we hit text
    flushBullets();

    if (!currentText) {
      currentText = trimmed;
      continue;
    }

    // Decide if this line continues the previous (wrapped sentence) or starts a new paragraph
    const cleaned = currentText.replace(/\*+$/, '').trim();
    const endsWithTerminalPunct = /[.!?:]["')\]]?$/.test(cleaned);
    if (endsWithTerminalPunct) {
      flushText();
      currentText = trimmed;
    } else {
      currentText += ' ' + trimmed;
    }
  }

  flushText();
  flushBullets();

  return blocks;
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
  },
  paragraphLast: {
    marginBottom: 0,
  },
  bulletList: {
    marginTop: 2,
    marginBottom: 8,
  },
  bulletListLast: {
    marginBottom: 0,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bullet: {
    color: colors.buttonKeywords,
    fontWeight: '900',
    marginRight: 10,
    marginTop: 0,
  },
  bulletTextWrapper: {
    flex: 1,
  },
});
