import binaryExtensions from './binary';
import textExtensions from './text';

export interface EncodingOpts {
  /** Defaults to 24 */
  chunkLength?: number,
  /** If not provided, will check the start, beginning, and end */
  chunkBegin?: number,
}

/**
 * Determine if the filename and/or buffer is text.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
export function isText(
  filename?: string | null,
  buffer?: ArrayBuffer | null,
): boolean | null {
  // Test extensions
  if (filename) {
    // Extract filename
    const parts = filename.split('/').pop()?.split('.').reverse() ?? [];

    // Cycle extensions
    for (const extension of parts) {
      if (textExtensions.indexOf(extension) !== -1) {
        return true;
      }
      if (binaryExtensions.indexOf(extension) !== -1) {
        return false;
      }
    }
  }

  // Fallback to encoding if extension check was not enough
  if (buffer) {
    return getEncoding(buffer) === 'utf8';
  }

  // No buffer was provided
  return null;
}

/**
 * Determine if the filename and/or buffer is binary.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
export function isBinary(filename?: string | null, buffer?: ArrayBuffer | null) {
  const text = isText(filename, buffer);
  if (text == null) return null;
  return !text;
}

/**
 * Get the encoding of a buffer.
 * Checks the start, middle, and end of the buffer for characters that are unrecognized within UTF8 encoding.
 * History has shown that inspection at all three locations is necessary.
 * @returns Will be `null` if `buffer` was not provided. Otherwise will be either `'utf8'` or `'binary'`
 */
export function getEncoding(
  buffer: ArrayBuffer | null,
  opts?: EncodingOpts,
): 'utf8' | 'binary' | null {
  // Check
  if (!buffer) return null

  // Convert to Uint8Array for byte access
  const bytes = new Uint8Array(buffer);

  // Prepare
  const textEncoding = 'utf8';
  const binaryEncoding = 'binary';
  const chunkLength = opts?.chunkLength ?? 24;
  let chunkBegin = opts?.chunkBegin ?? 0;

  // Discover
  if (opts?.chunkBegin == null) {
    // Start
    let encoding = getEncoding(buffer, {chunkLength, chunkBegin});
    if (encoding === textEncoding) {
      // Middle
      chunkBegin = Math.max(0, Math.floor(bytes.length / 2) - chunkLength);
      encoding = getEncoding(buffer, {
        chunkLength,
        chunkBegin,
      });
      if (encoding === textEncoding) {
        // End
        chunkBegin = Math.max(0, bytes.length - chunkLength);
        encoding = getEncoding(buffer, {
          chunkLength,
          chunkBegin,
        });
      }
    }

    // Return
    return encoding;
  }

  // Extract
  chunkBegin = getChunkBegin(bytes, chunkBegin);
  if (chunkBegin === -1) {
    return binaryEncoding;
  }

  const chunkEnd = getChunkEnd(
    bytes,
    Math.min(bytes.length, chunkBegin + chunkLength)
  );

  if (chunkEnd > bytes.length) {
    return binaryEncoding;
  }

  const contentChunkUTF8 = new TextDecoder('utf-8').decode(bytes.slice(chunkBegin, chunkEnd));

  // Detect encoding
  for (let i = 0; i < contentChunkUTF8.length; ++i) {
    const charCode = contentChunkUTF8.charCodeAt(i);
    if (charCode === 65533 || charCode <= 8) {
      // 8 and below are control characters (e.g. backspace, null, eof, etc.)
      // 65533 is the unknown character
      // console.log(charCode, contentChunkUTF8[i])
      return binaryEncoding;
    }
  }

  // Return
  return textEncoding;
}

function getChunkBegin(bytes: Uint8Array, chunkBegin: number) {
  // If it's the beginning, just return.
  if (chunkBegin === 0) {
    return 0;
  }

  if (!isLaterByteOfUtf8(bytes[chunkBegin])) {
    return chunkBegin;
  }

  let begin = chunkBegin - 3;

  if (begin >= 0) {
    if (isFirstByteOf4ByteChar(bytes[begin])) {
      return begin;
    }
  }

  begin = chunkBegin - 2;

  if (begin >= 0) {
    if (
      isFirstByteOf4ByteChar(bytes[begin]) ||
      isFirstByteOf3ByteChar(bytes[begin])
    ) {
      return begin;
    }
  }

  begin = chunkBegin - 1;

  if (begin >= 0) {
    // Is it a 4-byte, 3-byte utf8 character?
    if (
      isFirstByteOf4ByteChar(bytes[begin]) ||
      isFirstByteOf3ByteChar(bytes[begin]) ||
      isFirstByteOf2ByteChar(bytes[begin])
    ) {
      return begin;
    }
  }

  return -1;
}

function getChunkEnd(bytes: Uint8Array, chunkEnd: number) {
  // If it's the end, just return.
  if (chunkEnd === bytes.length) {
    return chunkEnd;
  }

  let index = chunkEnd - 3;

  if (index >= 0) {
    if (isFirstByteOf4ByteChar(bytes[index])) {
      return chunkEnd + 1;
    }
  }

  index = chunkEnd - 2;

  if (index >= 0) {
    if (isFirstByteOf4ByteChar(bytes[index])) {
      return chunkEnd + 2;
    }

    if (isFirstByteOf3ByteChar(bytes[index])) {
      return chunkEnd + 1;
    }
  }

  index = chunkEnd - 1;

  if (index >= 0) {
    if (isFirstByteOf4ByteChar(bytes[index])) {
      return chunkEnd + 3;
    }

    if (isFirstByteOf3ByteChar(bytes[index])) {
      return chunkEnd + 2;
    }

    if (isFirstByteOf2ByteChar(bytes[index])) {
      return chunkEnd + 1;
    }
  }

  return chunkEnd;
}

function isFirstByteOf4ByteChar(byte: number) {
  return byte >> 3 === 30; // 11110xxx?
}

function isFirstByteOf3ByteChar(byte: number) {
  return byte >> 4 === 14; // 1110xxxx?
}

function isFirstByteOf2ByteChar(byte: number) {
  return byte >> 5 === 6; // 110xxxxx?
}

function isLaterByteOfUtf8(byte: number) {
  return byte >> 6 === 2; // 10xxxxxx?
}
