/**
 * AI 未來探索平台 GitHub Pages Google 帳號登入 API
 *
 * 使用方式：
 * 1. 建立 Google Sheet，複製 Sheet ID。
 * 2. 建立 Google Cloud OAuth Web Client ID。
 * 3. 修改下方 SPREADSHEET_ID 與 GOOGLE_CLIENT_ID。
 * 4. Deploy > New deployment > Web app。
 * 5. Execute as: Me。
 * 6. Who has access: Anyone。
 * 7. 將 Web App URL 貼回 index.html 的 APPS_SCRIPT_URL。
 */

const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const GOOGLE_CLIENT_ID = 'PASTE_YOUR_GOOGLE_OAUTH_CLIENT_ID_HERE';
const USERS_SHEET_NAME = 'users';
const LOGIN_LOGS_SHEET_NAME = 'login_logs';

function doGet() {
  return jsonResponse({
    ok: true,
    message: 'AI Future Exploration Google account API is running.',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    const params = readParams(e);
    const action = String(params.action || '').trim();

    if (action === 'googleLogin') {
      return googleLogin(params);
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

function googleLogin(params) {
  const idToken = String(params.idToken || '').trim();

  if (!idToken) {
    return jsonResponse({ ok: false, message: '缺少 Google 登入授權資料。' });
  }

  const profile = verifyGoogleIdToken(idToken);
  const email = normalizeEmail(profile.email);
  const name = String(profile.name || email).trim();
  const picture = String(profile.picture || '').trim();
  const googleSub = String(profile.sub || '').trim();

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, message: 'Google 帳號沒有提供有效 email。' });
  }

  if (String(profile.email_verified) !== 'true') {
    return jsonResponse({ ok: false, message: 'Google 帳號 email 尚未驗證。' });
  }

  const sheet = getUsersSheet();
  let user = findUserByEmail(sheet, email);
  const now = new Date();

  if (user) {
    updateExistingGoogleUser(sheet, user.rowIndex, {
      name: name,
      email: email,
      googleSub: googleSub,
      picture: picture,
      lastLoginAt: now
    });
  } else {
    const userId = Utilities.getUuid();
    sheet.appendRow([
      userId,
      now,
      name,
      email,
      '',
      '',
      'active',
      '',
      '',
      googleSub,
      picture,
      'google',
      now
    ]);

    user = {
      id: userId,
      name: name,
      email: email,
      status: 'active'
    };
  }

  appendLoginLog({
    id: user.id,
    email: email,
    name: name,
    provider: 'google'
  });

  return jsonResponse({
    ok: true,
    message: 'Google 登入成功。',
    user: {
      id: user.id,
      name: name,
      email: email,
      picture: picture
    }
  });
}

function verifyGoogleIdToken(idToken) {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.indexOf('PASTE_YOUR') === 0) {
    throw new Error('尚未設定 GOOGLE_CLIENT_ID。');
  }

  const response = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true }
  );

  const status = response.getResponseCode();
  const payload = JSON.parse(response.getContentText() || '{}');

  if (status !== 200) {
    throw new Error(payload.error_description || 'Google token 驗證失敗。');
  }

  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error('Google token 的 Client ID 不符合。');
  }

  if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
    throw new Error('Google token 發行來源不正確。');
  }

  return payload;
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
    'admin_tag',
    'google_sub',
    'picture',
    'auth_provider',
    'last_login_at'
  ]);

  return sheet;
}

function getLoginLogsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(LOGIN_LOGS_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(LOGIN_LOGS_SHEET_NAME);
  }

  ensureHeader(sheet, [
    'logged_in_at',
    'user_id',
    'email',
    'name',
    'provider'
  ]);

  return sheet;
}

function ensureHeader(sheet, headers) {
  const currentWidth = Math.max(sheet.getLastColumn(), headers.length);
  const firstRow = sheet.getRange(1, 1, 1, currentWidth).getValues()[0];
  const hasHeader = firstRow.some(function (value) {
    return String(value || '').trim() !== '';
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  headers.forEach(function (header) {
    if (firstRow.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
    }
  });

  sheet.setFrozenRows(1);
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
        status: String(row[6] || 'active')
      };
    }
  }

  return null;
}

function updateExistingGoogleUser(sheet, rowIndex, profile) {
  sheet.getRange(rowIndex, 3).setValue(profile.name);
  sheet.getRange(rowIndex, 4).setValue(profile.email);
  sheet.getRange(rowIndex, 7).setValue('active');
  sheet.getRange(rowIndex, 10).setValue(profile.googleSub);
  sheet.getRange(rowIndex, 11).setValue(profile.picture);
  sheet.getRange(rowIndex, 12).setValue('google');
  sheet.getRange(rowIndex, 13).setValue(profile.lastLoginAt);
}

function appendLoginLog(user) {
  const sheet = getLoginLogsSheet();
  sheet.appendRow([
    new Date(),
    user.id,
    user.email,
    user.name,
    user.provider || 'google'
  ]);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
