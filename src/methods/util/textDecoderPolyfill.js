import { TextEncoder, TextDecoder } from 'fastestsmallesttextencoderdecoder';

if (!window.TextEncoder) window.TextEncoder = TextEncoder;
if (!window.TextDecoder) window.TextDecoder = TextDecoder;
