export function shortenString(str: string) {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
}

export function splitFileName(str: string) {
  const idx = str.lastIndexOf('.');
  return [str.substring(0, idx), str.substring(idx, str.length)];
}

export const emojiToUni = (str: string) => {
  const rex =
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
  const updated = str.replace(
    rex,
    (match: string) => `[e-${match.codePointAt(0)?.toString(16)}]`
  );
  return updated;
};

export const uniToEmoji = (str: string) => {
  return str.replace(/\[e-([0-9a-fA-F]+)\]/g, (match, hex) =>
    String.fromCodePoint(Number.parseInt(hex, 16))
  );
};

export const strToBuffer = (str: string) => {
  return new Uint8Array(
    emojiToUni(str)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
};

export const bufferToStr = (ab: Iterable<number>) => {
  return new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), '');
};

function loadTextFileAjaxSync(filePath: string, mimeType: string) {
  try {
    if (filePath.endsWith('undefined')) return null;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath, false);
    if (mimeType != null) {
      if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType(mimeType);
      }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
      return xmlhttp.responseText;
    }
  } catch (error) {
    return null;
  }
}

export function loadJSON(filePath: string) {
  // Load json file;
  const json = loadTextFileAjaxSync(filePath, 'application/json;charset=UTF-8');
  // Parse json
  return json ? JSON.parse(uniToEmoji(json)) : {};
}

export const blobToBase64 = (url: string) => {
  return new Promise(async (resolve) => {
    // do a request to the blob uri
    const response = await fetch(url);

    // response has a method called .blob() to get the blob file
    const blob = await response.blob();

    // instantiate a file reader
    const fileReader = new FileReader();

    // read the file
    fileReader.readAsDataURL(blob);

    fileReader.onloadend = function () {
      resolve(fileReader.result); // Here is the base64 string
    };
  });
};
