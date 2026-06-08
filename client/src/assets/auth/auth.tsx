let user: any = null;

/**
 * Redireciona para login com Discord
 */
export function auth() {
  if (user == null) {
    window.location.href = import.meta.env.VITE_SERVER_URL + '/auth/discord';
  }
}

/**
 * Busca usuário autenticado no backend
 */
export async function getAuth() {
  try {
    const res = await fetch(import.meta.env.VITE_SERVER_URL + '/me', {
      credentials: 'include',
    });

    if (!res.ok) {
      user = null;
      return null;
    }

    const data = await res.json();

    if (!data.authenticated) {
      user = null;
      return null;
    }

    user = data.user;
    loadData();
    return user;
  } catch (err) {
    console.error('Auth error:', err);
    user = null;
    return null;
  }
}
getAuth();

/**
 * Retorna usuário salvo em memória
 */
export function getUser() {
  return user;
}

/**
 * Logout
 */
export async function logout() {
  await fetch(import.meta.env.VITE_SERVER_URL + '/logout', {
    method: 'POST',
    credentials: 'include',
  });

  user = null;
}

/**
 * Carrega dados extras após login
 */
function loadData() {
  if (!user) return;

  const avatar = `https://cdn.discordapp.com/avatars/${user.discord.id}/${user.discord.avatar}?size=128`;

  const el = document.querySelector('.user-avatar');

  if (!(el instanceof HTMLElement)) return;

  el.style.backgroundImage = `url(${avatar})`;
}
