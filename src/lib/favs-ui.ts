import { gsap } from './motion';
import { getFavs, toggleFav } from './store';

/** Boutons cœur : `<button data-fav="slug">` — un seul écouteur délégué pour tout le site. */
function sync() {
  const favs = new Set(getFavs());
  document.querySelectorAll<HTMLElement>('[data-fav]').forEach((b) => {
    const on = favs.has(b.dataset.fav!);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Retirer des favoris' : 'Ajouter aux favoris');
  });
}

function burst(btn: HTMLElement) {
  const r = btn.getBoundingClientRect();
  const colors = ['#E9694F', '#F3D677', '#F0A8BF', '#A2C48A', '#F0973F'];
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('span');
    dot.className = 'fav-burst';
    Object.assign(dot.style, {
      left: `${r.left + r.width / 2}px`,
      top: `${r.top + r.height / 2}px`,
      background: colors[i % colors.length],
    });
    document.body.appendChild(dot);
    const a = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 22 + Math.random() * 14;
    gsap.fromTo(
      dot,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: Math.cos(a) * dist,
        y: Math.sin(a) * dist,
        scale: 0,
        duration: 0.7,
        ease: 'power3.out',
        onComplete: () => dot.remove(),
      },
    );
  }
}

let bound = false;
export function initFavButtons() {
  sync();
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const on = toggleFav(btn.dataset.fav!);
    sync();
    const icon = btn.querySelector('svg');
    gsap.fromTo(icon, { scale: on ? 0.6 : 1.1 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    if (on) burst(btn);
  });
}
