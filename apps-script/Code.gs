/**
 * AI 未來探索平台 GitHub Pages 簡易帳號 API
 *
 * 使用方式：
 * 1. 建立一份 Google Sheet。
 * 2. 開啟 Apps Script 或到 https://script.google.com/create 建立專案。
 * 3. 貼上本檔內容。
 * 4. 修改 SPREADSHEET_ID。
 * 5. Deploy > New deployment > Web app。
 * 6. Execute as: Me。
 * 7. Who has access: Anyone。
 * 8. 將 Web App URL 貼回 index.html 的 APPS_SCRIPT_URL。
 */

const SPREADSHEET_ID = '1eNIdZat8egRP0Nrp1fTopoZy0k_VjRWXzCGKVAUvqZg';
const USERS_SHEET_NAME = 'users';
const SESSIONS_SHEET_NAME = 'login_logs';

function doGet() {
  return jsonResponse({
    ok: true,
    message: 'AI Future Exploration account API is running.',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    const params = readParams(e);
    const action = String(params.action || '').trim();

    if (action === 'register') {
      return registerUser(params);
    }

    if (action === 'login') {
      return loginUser(params);
    }

    return jsonResponse({
      ok: false,
      message: 'Unknown action.'
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message || String(error)
    });
  }
}

function registerUser(params) {
  const name = String(params.name || '').trim();
  const email = normalizeEmail(params.email);
  const password = String(params.password || '');

  if (!name) {
    return jsonResponse({ ok: false, message: '請輸入姓名。' });
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, message: '請輸入有效的 Gmail / 電子信箱。' });
  }

  if (password.length < 6) {
    return jsonResponse({ ok: false, message: '密碼至少需要 6 個字元。' });
  }

  const sheet = getUsersSheet();
  const existing = findUserByEmail(sheet, email);

  if (existing) {
    return jsonResponse({ ok: false, message: '這個信箱已經註冊過，請直接登入。' });
  }

  const now = new Date();
  const salt = Utilities.getUuid();
  const passwordHash = hashPassword(password, salt);
  const userId = Utilities.getUuid();

  sheet.appendRow([
    userId,
    now,
    name,
    email,
    salt,
    passwordHash,
    'active',
    '',
    ''
  ]);

  return jsonResponse({
    ok: true,
    message: '註冊成功。',
    user: {
      id: userId,
      name: name,
      email: email
    }
  });
}

function loginUser(params) {
  const email = normalizeEmail(params.email);
  const password = String(params.password || '');

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, message: '請輸入有效的 Gmail / 電子信箱。' });
  }

  const sheet = getUsersSheet();
  const user = findUserByEmail(sheet, email);

  if (!user || user.status !== 'active') {
    return jsonResponse({ ok: false, message: '找不到這個帳號，或帳號尚未啟用。' });
  }

  const passwordHash = hashPassword(password, user.salt);

  if (passwordHash !== user.passwordHash) {
    return jsonResponse({ ok: false, message: '信箱或密碼錯誤。' });
  }

  appendLoginLog(user);

  return jsonResponse({
    ok: true,
    message: '登入成功。',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}

function readParams(e) {
  const params = {};

  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (key) {
      params[key] = e.parameter[key];
    });
  }

  if (e && e.postData && e.postData.contents) {
    const type = String(e.postData.type || '');

    if (type.indexOf('application/json') >= 0) {
      const json = JSON.parse(e.postData.contents);
      Object.keys(json).forEach(function (key) {
        params[key] = json[key];
      });
    }
  }

  return params;
}

function getUsersSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(USERS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(USERS_SHEET_NAME);
  }

  ensureHeader(sheet, [
    'user_id',
    'created_at',
    'name',
    'email',
    'password_salt',
    'password_hash',
    'status',
    'note',
    'admin_tag'
  ]);

  return sheet;
}

function getLoginLogsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SESSIONS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SESSIONS_SHEET_NAME);
  }

  ensureHeader(sheet, [
    'logged_in_at',
    'user_id',
    'email',
    'name'
  ]);

  return sheet;
}

function ensureHeader(sheet, headers) {
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeader = firstRow.some(function (value) {
    return String(value || '').trim() !== '';
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function findUserByEmail(sheet, email) {
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const rowEmail = normalizeEmail(row[3]);

    if (rowEmail === email) {
      return {
        rowIndex: i + 1,
        id: String(row[0] || ''),
        createdAt: row[1],
        name: String(row[2] || ''),
        email: rowEmail,
        salt: String(row[4] || ''),
        passwordHash: String(row[5] || ''),
        status: String(row[6] || '')
      };
    }
  }

  return null;
}

function appendLoginLog(user) {
  const sheet = getLoginLogsSheet();
  sheet.appendRow([
    new Date(),
    user.id,
    user.email,
    user.name
  ]);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password, salt) {
  const raw = salt + '::' + password;
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);

  return bytes.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
