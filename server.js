const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 8095;
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'bloodin.db.json');
const PREVIEW_HTML = path.join(__dirname, 'preview.html');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_bloodin_salt').digest('hex');
}

function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const demoUserId = 'user-amara-001';
    const initialDb = {
      users: [
        {
          id: demoUserId,
          name: 'Amara Okafor',
          email: 'amara@bloodin.health',
          passwordHash: hashPassword('bloodin123'),
          bloodGroup: 'O-',
          genotype: 'AS',
          allergies: 'Penicillin, Latex',
          emergencyContactName: 'Dr. Tunde Okafor (Spouse)',
          emergencyContactPhone: '+1 (555) 234-8910',
          createdAt: '2026-11-10T09:00:00Z',
        },
      ],
      sessions: {},
      tracks: [
        {
          id: 'track-101',
          userId: demoUserId,
          category: 'Hb Level (g/dL)',
          title: 'Routine Complete Blood Count (CBC)',
          value: '13.4 g/dL',
          notes: 'Normal hemoglobin concentration; steady hydration maintained.',
          recordedAt: '2026-11-12 08:30',
        },
        {
          id: 'track-102',
          userId: demoUserId,
          category: 'Blood Donation',
          title: 'Universal O- Whole Blood Donation',
          value: '450 mL Unit',
          notes: 'Donated at Metro Regional Blood Center. Post-donation iron supplement started.',
          recordedAt: '2026-11-15 14:15',
        },
        {
          id: 'track-103',
          userId: demoUserId,
          category: 'Lab / Electrophoresis',
          title: 'HPLC Hemoglobin Fractionation',
          value: 'HbA 58.2% | HbS 38.4% | HbA2 3.4%',
          notes: 'Confirmed AS carrier trait via accredited HPLC reference lab.',
          recordedAt: '2026-11-17 11:00',
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

function readDb() {
  initDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(u) {
  const { passwordHash, ...safe } = u;
  return safe;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function getAuthenticatedUser(req, db) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token || !db.sessions[token]) return null;
  const userId = db.sessions[token];
  return db.users.find((u) => u.id === userId) || null;
}

initDatabase();

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Serve UI preview
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(PREVIEW_HTML, 'utf-8'));
  }

  // POST /api/auth/signup
  if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
    try {
      const body = await parseBody(req);
      const {
        name,
        email,
        password,
        bloodGroup = 'O+',
        genotype = 'AA',
        allergies = 'None Known (NKDA)',
        emergencyContactName = 'Not Specified',
        emergencyContactPhone = 'Not Specified',
      } = body;

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'Name, email, and password are required.' });
      }

      const db = readDb();
      const normalizedEmail = String(email).trim().toLowerCase();
      if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return sendJson(res, 409, { error: 'An account with this email already exists.' });
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        bloodGroup,
        genotype,
        allergies: String(allergies).trim() || 'None Known (NKDA)',
        emergencyContactName: String(emergencyContactName).trim() || 'Not Specified',
        emergencyContactPhone: String(emergencyContactPhone).trim() || 'Not Specified',
        createdAt: new Date().toISOString(),
      };

      const welcomeTrack = {
        id: 'track-' + Date.now(),
        userId: newUser.id,
        category: 'Lab / Electrophoresis',
        title: 'Baseline Bloodin Profile Created',
        value: `${newUser.bloodGroup} • ${newUser.genotype}`,
        notes: 'Initial hematology profile registered in Bloodin database.',
        recordedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      db.users.push(newUser);
      db.tracks.unshift(welcomeTrack);

      const token = crypto.randomBytes(24).toString('hex');
      db.sessions[token] = newUser.id;
      writeDb(db);

      return sendJson(res, 201, {
        token,
        user: sanitizeUser(newUser),
        tracks: db.tracks.filter((t) => t.userId === newUser.id),
      });
    } catch (err) {
      return sendJson(res, 500, { error: 'Failed to create account.' });
    }
  }

  // POST /api/auth/login
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    try {
      const body = await parseBody(req);
      const { email, password } = body;
      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required.' });
      }

      const db = readDb();
      const normalizedEmail = String(email).trim().toLowerCase();
      const user = db.users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail &&
          u.passwordHash === hashPassword(password)
      );

      if (!user) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      const token = crypto.randomBytes(24).toString('hex');
      db.sessions[token] = user.id;
      writeDb(db);

      return sendJson(res, 200, {
        token,
        user: sanitizeUser(user),
        tracks: db.tracks.filter((t) => t.userId === user.id),
      });
    } catch {
      return sendJson(res, 500, { error: 'Login failed.' });
    }
  }

  // GET /api/me
  if (req.method === 'GET' && url.pathname === '/api/me') {
    const db = readDb();
    const user = getAuthenticatedUser(req, db);
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });
    return sendJson(res, 200, {
      user: sanitizeUser(user),
      tracks: db.tracks.filter((t) => t.userId === user.id),
    });
  }

  // PUT /api/profile
  if (req.method === 'PUT' && url.pathname === '/api/profile') {
    const db = readDb();
    const user = getAuthenticatedUser(req, db);
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });
    const body = await parseBody(req);
    if (body.bloodGroup) user.bloodGroup = body.bloodGroup;
    if (body.genotype) user.genotype = body.genotype;
    if (body.name) user.name = body.name;
    if (body.allergies !== undefined) user.allergies = body.allergies;
    if (body.emergencyContactName !== undefined)
      user.emergencyContactName = body.emergencyContactName;
    if (body.emergencyContactPhone !== undefined)
      user.emergencyContactPhone = body.emergencyContactPhone;
    writeDb(db);
    return sendJson(res, 200, { user: sanitizeUser(user) });
  }

  // GET /api/tracks
  if (req.method === 'GET' && url.pathname === '/api/tracks') {
    const db = readDb();
    const user = getAuthenticatedUser(req, db);
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });
    return sendJson(res, 200, {
      tracks: db.tracks.filter((t) => t.userId === user.id),
    });
  }

  // POST /api/tracks
  if (req.method === 'POST' && url.pathname === '/api/tracks') {
    const db = readDb();
    const user = getAuthenticatedUser(req, db);
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });

    const body = await parseBody(req);
    const { category, title, value, notes } = body;
    if (!title || !value) {
      return sendJson(res, 400, { error: 'Track title and value/metric are required.' });
    }

    const newTrack = {
      id: 'track-' + Date.now(),
      userId: user.id,
      category: category || 'Hb Level (g/dL)',
      title: String(title).trim(),
      value: String(value).trim(),
      notes: String(notes || '').trim(),
      recordedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    db.tracks.unshift(newTrack);
    writeDb(db);
    return sendJson(res, 201, {
      track: newTrack,
      tracks: db.tracks.filter((t) => t.userId === user.id),
    });
  }

  // DELETE /api/tracks/:id
  if (req.method === 'DELETE' && url.pathname.startsWith('/api/tracks/')) {
    const db = readDb();
    const user = getAuthenticatedUser(req, db);
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });

    const trackId = url.pathname.split('/').pop();
    db.tracks = db.tracks.filter(
      (t) => !(t.id === trackId && t.userId === user.id)
    );
    writeDb(db);
    return sendJson(res, 200, {
      tracks: db.tracks.filter((t) => t.userId === user.id),
    });
  }

  return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Bloodin API & Database Server running at http://localhost:${PORT}`);
});
