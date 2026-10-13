import { describe, expect, it } from 'vitest';
import { readingTimeMinutes, slugifyTitle } from './utils.js';

describe('readingTimeMinutes', () => {
  it('returns at least 1 minute for empty/short text', () => {
    expect(readingTimeMinutes('')).toBe(1);
    expect(readingTimeMinutes('hello world')).toBe(1);
  });

  it('ceil(words / 200)', () => {
    expect(readingTimeMinutes(Array(201).fill('word').join(' '))).toBe(2);
    expect(readingTimeMinutes(Array(400).fill('word').join(' '))).toBe(2);
    expect(readingTimeMinutes(Array(401).fill('word').join(' '))).toBe(3);
  });
});

describe('slugifyTitle', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyTitle('Hello World Post!')).toBe('hello-world-post');
  });

  it('collapses separators and trims dashes', () => {
    expect(slugifyTitle('  a__b--c  ')).toBe('a-b-c');
  });
});
