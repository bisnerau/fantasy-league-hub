import { prefersReducedMotion } from '@/lib/motion';

// Adapted from React Bits ClickSpark (MIT + Commons Clause) as CSS only. Call
// it after something has really happened (a verified save), never on tap.
export function spark(target: Element | null, { gold = false } = {}) {
  if (!target || prefersReducedMotion()) return;
  const rect = target.getBoundingClientRect();
  const burst = document.createElement('span');
  burst.className = 'click-spark';
  burst.setAttribute('aria-hidden', 'true');
  if (gold) burst.dataset.gold = '';
  burst.style.left = `${rect.left + rect.width / 2}px`;
  burst.style.top = `${rect.top + rect.height / 2}px`;
  for (let index = 0; index < 8; index += 1) {
    const ray = document.createElement('span');
    ray.style.setProperty('--angle', `${index * 45}deg`);
    burst.appendChild(ray);
  }
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 700);
}
