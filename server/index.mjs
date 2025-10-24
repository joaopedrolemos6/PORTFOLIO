import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const CONTACT_LOG_FILE = path.join(DATA_DIR, 'contact-log.txt');

const parsedPort = Number.parseInt(process.env.PORT ?? '4000', 10);
const PORT = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';
const ttlMinutes = Number.parseInt(process.env.TOKEN_TTL_MINUTES ?? '120', 10);
const TOKEN_TTL = Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes * 60 * 1000 : 120 * 60 * 1000;
const allowedOrigins = (process.env.CORS_ORIGINS ?? '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins.push('*');
}

const SMTP_HOST = process.env.SMTP_HOST ?? '';
const parsedSmtpPort = Number.parseInt(process.env.SMTP_PORT ?? '465', 10);
const SMTP_PORT = Number.isFinite(parsedSmtpPort) && parsedSmtpPort > 0 ? parsedSmtpPort : 465;
const SMTP_USER = process.env.SMTP_USER ?? '';
const SMTP_PASS = process.env.SMTP_PASS ?? '';
const CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT ?? process.env.SMTP_TO ?? '';
const EMAIL_SUBJECT = process.env.EMAIL_SUBJECT ?? 'Novo contato pelo portfólio';

await fs.mkdir(DATA_DIR, { recursive: true });

try {
  await fs.access(PROJECTS_FILE);
} catch (error) {
  await fs.writeFile(PROJECTS_FILE, '[]', 'utf-8');
}

const activeTokens = new Map();

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function applyCors(req, res) {
  const originHeader = req.headers.origin;
  const allowAny = allowedOrigins.includes('*');

  if (allowAny && originHeader) {
    res.setHeader('Access-Control-Allow-Origin', originHeader);
  } else if (allowAny) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (originHeader && allowedOrigins.includes(originHeader)) {
    res.setHeader('Access-Control-Allow-Origin', originHeader);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk.toString();
      if (data.length > 1_000_000) {
        reject(new HttpError(413, 'Payload muito grande.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new HttpError(400, 'JSON inválido.'));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function readProjects() {
  const content = await fs.readFile(PROJECTS_FILE, 'utf-8');
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error('Arquivo de projetos corrompido.');
  }
  return parsed.map((project) => ({
    id: String(project.id ?? crypto.randomUUID()),
    title: String(project.title ?? ''),
    description: String(project.description ?? ''),
    image: project.image ? String(project.image) : '',
    tags: Array.isArray(project.tags)
      ? project.tags.map((tag) => String(tag))
      : typeof project.tags === 'string'
        ? project.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    githubUrl: String(project.githubUrl ?? ''),
    liveUrl: project.liveUrl ? String(project.liveUrl) : undefined,
  }));
}

async function writeProjects(projects) {
  await fs.writeFile(PROJECTS_FILE, `${JSON.stringify(projects, null, 2)}\n`, 'utf-8');
}

function cleanupTokens() {
  const now = Date.now();
  for (const [token, expiresAt] of activeTokens.entries()) {
    if (expiresAt <= now) {
      activeTokens.delete(token);
    }
  }
}

function issueToken() {
  cleanupTokens();
  const token = crypto.randomUUID();
  activeTokens.set(token, Date.now() + TOKEN_TTL);
  return token;
}

function ensureAuthenticated(req) {
  cleanupTokens();
  const authorization = req.headers.authorization ?? '';
  const [, token] = authorization.split(' ');

  if (!token) {
    throw new HttpError(401, 'Credenciais ausentes.');
  }

  const expiresAt = activeTokens.get(token);
  if (!expiresAt) {
    throw new HttpError(401, 'Sessão inválida ou expirada.');
  }

  if (expiresAt <= Date.now()) {
    activeTokens.delete(token);
    throw new HttpError(401, 'Sessão expirada.');
  }

  return token;
}

async function appendContactLog(entry, delivered) {
  const timestamp = new Date().toISOString();
  const logEntry = `[#${delivered ? 'ok' : 'fail'} ${timestamp}] ${entry.name} <${entry.email}>\n${entry.message}\n\n`;
  await fs.appendFile(CONTACT_LOG_FILE, logEntry, 'utf-8');
}

function assertContactConfiguration() {
  if (!CONTACT_RECIPIENT) {
    throw new HttpError(500, 'Destinatário do email não configurado (CONTACT_RECIPIENT).');
  }
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new HttpError(500, 'Servidor SMTP não configurado. Defina SMTP_HOST, SMTP_USER e SMTP_PASS.');
  }
}

function normalizeNewProject(data) {
  const title = String(data.title ?? '').trim();
  const description = String(data.description ?? '').trim();
  const githubUrl = String(data.githubUrl ?? '').trim();
  const image = data.image ? String(data.image).trim() : '';
  const liveUrl = data.liveUrl ? String(data.liveUrl).trim() : '';

  if (!title) {
    throw new HttpError(400, 'O título é obrigatório.');
  }

  if (!description) {
    throw new HttpError(400, 'A descrição é obrigatória.');
  }

  if (!githubUrl) {
    throw new HttpError(400, 'O link do GitHub é obrigatório.');
  }

  let tags = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.map((tag) => String(tag).trim()).filter(Boolean);
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return {
    id: crypto.randomUUID(),
    title,
    description,
    image,
    tags,
    githubUrl,
    liveUrl: liveUrl || undefined,
  };
}

function validateContactPayload(payload) {
  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (!name || !email || !message) {
    throw new HttpError(400, 'Nome, email e mensagem são obrigatórios.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HttpError(400, 'Informe um email válido.');
  }

  return { name, email, message };
}

function smtpExchange(socket, command) {
  return new Promise((resolve, reject) => {
    let buffer = '';

    const cleanup = () => {
      socket.removeListener('data', onData);
      socket.removeListener('error', onError);
      socket.removeListener('timeout', onTimeout);
      socket.setTimeout(0);
    };

    const onTimeout = () => {
      cleanup();
      reject(new Error('Tempo limite ao comunicar com o servidor SMTP.'));
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk) => {
      buffer += chunk.toString();
      if (!buffer.endsWith('\r\n')) {
        return;
      }

      const lines = buffer.trimEnd().split('\r\n');
      const lastLine = lines[lines.length - 1];
      const match = lastLine.match(/^(\d{3})([ \-])/);
      if (!match) {
        return;
      }

      const code = Number(match[1]);
      const isFinal = match[2] === ' ';
      if (!isFinal) {
        return;
      }

      cleanup();

      if (code >= 400) {
        reject(new Error(lastLine));
      } else {
        resolve({ code, message: buffer });
      }
    };

    socket.on('data', onData);
    socket.on('error', onError);
    socket.on('timeout', onTimeout);
    socket.setTimeout(15000);

    if (typeof command === 'string') {
      socket.write(`${command}\r\n`);
    }
  });
}

async function sendEmail({ fromName, fromEmail, message }) {
  assertContactConfiguration();

  const socket = tls.connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
  });

  try {
    await smtpExchange(socket);
    await smtpExchange(socket, `EHLO ${SMTP_HOST}`);
    await smtpExchange(socket, 'AUTH LOGIN');
    await smtpExchange(socket, Buffer.from(SMTP_USER, 'utf-8').toString('base64'));
    await smtpExchange(socket, Buffer.from(SMTP_PASS, 'utf-8').toString('base64'));
    const mailFrom = SMTP_USER.includes('@') ? SMTP_USER : fromEmail;
    await smtpExchange(socket, `MAIL FROM:<${mailFrom}>`);
    await smtpExchange(socket, `RCPT TO:<${CONTACT_RECIPIENT}>`);
    await smtpExchange(socket, 'DATA');

    const normalizedMessage = message.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');
    const emailBody = [
      `Subject: ${EMAIL_SUBJECT}`,
      `From: "${fromName}" <${fromEmail}>`,
      `Reply-To: ${fromEmail}`,
      `To: ${CONTACT_RECIPIENT}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      normalizedMessage,
      '.\r\n',
    ].join('\r\n');

    socket.write(emailBody);
    await smtpExchange(socket);
    await smtpExchange(socket, 'QUIT');
  } finally {
    socket.end();
  }
}

function sendJson(res, statusCode, payload) {
  if (!res.headersSent) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  res.end(JSON.stringify(payload));
}

function handleError(res, error) {
  if (error instanceof HttpError) {
    sendJson(res, error.statusCode, { message: error.message });
    return;
  }

  console.error('Erro inesperado no servidor:', error);
  sendJson(res, 500, { message: 'Erro interno do servidor.' });
}

const server = http.createServer(async (req, res) => {
  try {
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/projects') {
      const projects = await readProjects();
      sendJson(res, 200, projects);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const { password } = await readJsonBody(req);
      if (String(password ?? '') !== ADMIN_PASSWORD) {
        throw new HttpError(401, 'Senha inválida.');
      }

      const token = issueToken();
      sendJson(res, 200, { token, expiresInMinutes: TOKEN_TTL / 60000 });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/projects') {
      ensureAuthenticated(req);
      const payload = await readJsonBody(req);
      const newProject = normalizeNewProject(payload);
      const projects = await readProjects();
      const updatedProjects = [newProject, ...projects];
      await writeProjects(updatedProjects);
      sendJson(res, 201, newProject);
      return;
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/projects/')) {
      ensureAuthenticated(req);
      const projectId = url.pathname.split('/').pop();
      if (!projectId) {
        throw new HttpError(400, 'ID do projeto inválido.');
      }

      const projects = await readProjects();
      const index = projects.findIndex((project) => String(project.id) === String(projectId));
      if (index === -1) {
        throw new HttpError(404, 'Projeto não encontrado.');
      }

      projects.splice(index, 1);
      await writeProjects(projects);
      sendJson(res, 200, { message: 'Projeto removido com sucesso.' });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/contact') {
      const payload = await readJsonBody(req);
      const normalized = validateContactPayload(payload);

      try {
        await sendEmail(normalized);
        await appendContactLog(normalized, true).catch((logError) => {
          console.error('Erro ao registrar mensagem de contato:', logError);
        });
        sendJson(res, 200, { message: 'Mensagem enviada com sucesso! Em breve entrarei em contato.' });
      } catch (error) {
        await appendContactLog(normalized, false).catch((logError) => {
          console.error('Erro ao registrar mensagem de contato:', logError);
        });
        console.error('Erro ao enviar email de contato:', error);
        throw new HttpError(502, 'Não foi possível entregar a mensagem. Tente novamente mais tarde.');
      }
      return;
    }

    sendJson(res, 404, { message: 'Rota não encontrada.' });
  } catch (error) {
    handleError(res, error);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor do portfólio executando em http://localhost:${PORT}`);
  if (process.env.ADMIN_PASSWORD === undefined) {
    console.warn('ATENÇÃO: Nenhuma senha administrativa definida. Usando senha padrão "admin".');
  }
});

setInterval(cleanupTokens, 15 * 60 * 1000);
