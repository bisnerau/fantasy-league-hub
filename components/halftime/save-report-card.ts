import type { HalftimeTeam } from '@/lib/data/halftime/report';

/** A local PNG export. No upload, tracking request or public preview URL. */
export async function saveReportCard(team: HalftimeTeam) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Image export is unavailable in this browser');
  const text = (
    value: string,
    x: number,
    y: number,
    font: string,
    color = '#f0eee5',
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  };
  const wrapped = (
    value: string,
    y: number,
    font: string,
    lineHeight: number,
  ) => {
    ctx.font = font;
    let line = '';
    for (const word of value.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > 900 && line) {
        text(line, 90, y, font);
        y += lineHeight;
        line = word;
      } else line = next;
    }
    if (line) text(line, 90, y, font);
    return y + lineHeight;
  };
  ctx.fillStyle = '#142119';
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = '#32452e';
  ctx.lineWidth = 1;
  for (let x = 90; x < 1080; x += 180) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1350);
    ctx.stroke();
  }
  ctx.strokeStyle = '#75815a';
  ctx.strokeRect(45, 45, 990, 1260);
  text('MAC12', 90, 125, 'bold 46px Arial', '#e5c17c');
  text('THE HALFTIME SHOW / 2026', 90, 176, '20px monospace', '#bac5b2');
  text(
    `WEEK 7 DOSSIER / ${String(team.rank).padStart(2, '0')}`,
    90,
    247,
    '18px monospace',
    '#e5c17c',
  );
  text(team.name, 90, 309, '28px Arial', '#b2c0a8');
  const afterTitle = wrapped(team.team, 390, 'bold 62px Arial', 73);
  const statsY = Math.max(580, afterTitle + 80);
  text(team.record, 90, statsY, '145px Impact, sans-serif', '#e5c17c');
  text('THE RECORD', 95, statsY + 37, '17px monospace', '#b2c0a8');
  text(`#${team.rank}`, 690, statsY, '145px Impact, sans-serif');
  text('AT HALFWAY', 695, statsY + 37, '17px monospace', '#b2c0a8');
  ctx.strokeStyle = '#75815a';
  ctx.beginPath();
  ctx.moveTo(90, statsY + 70);
  ctx.lineTo(990, statsY + 70);
  ctx.stroke();
  text(
    `AI PICK #${team.ai}   /   ${team.points.toFixed(2)} POINTS   /   ${team.allPlay.join('–').replace(/–0$/, '')} ALL-PLAY`,
    90,
    statsY + 119,
    '20px monospace',
    '#c8d3ba',
  );
  wrapped(team.title, statsY + 193, 'bold 36px Arial', 49);
  text('SEVEN WEEKS ON TAPE', 90, 1010, '16px monospace', '#b2c0a8');
  ctx.strokeStyle = '#a9d5b1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  team.scores.forEach((p, i) => {
    const x = 90 + i * 150,
      y = 1170 - (p / 180) * 120;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  team.scores.forEach((p, i) => {
    const x = 90 + i * 150,
      y = 1170 - (p / 180) * 120;
    ctx.fillStyle = '#e5c17c';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    text(`W${i + 1}`, x - 12, 1211, '16px monospace', '#a7b299');
  });
  text('SEVEN DOWN. SEVEN TO GO.', 90, 1270, '18px monospace', '#e5c17c');
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value ? resolve(value) : reject(Error('Could not create report card')),
      'image/png',
    ),
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mac12-halftime-${team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
