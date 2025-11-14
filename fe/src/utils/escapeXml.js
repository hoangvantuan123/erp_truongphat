export const escapeXml = (str) => {
  if (typeof str !== 'string') {
      console.warn('escapeXml received a non-string value:', str);
      str = str == null ? '' : String(str); 
  }
  return str.replace(/[&<>"']/g, (char) => {
      switch (char) {
          case '&':
              return '&amp;';
          case '<':
              return '&lt;';
          case '>':
              return '&gt;';
          case '"':
              return '&quot;';
          case "'":
              return '&apos;';
          default:
              return char;
      }
  });
};
