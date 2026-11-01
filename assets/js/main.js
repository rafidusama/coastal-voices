// Mobile menu
const btn = document.querySelector('.menu-btn')
const nav = document.getElementById('nav')
btn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  btn.setAttribute('aria-expanded', String(open))
})

// Coastal Lab dropdown (click and keyboard)
const dd = document.querySelector('.dd')
const ddBtn = document.querySelector('.dd-btn')
ddBtn?.addEventListener('click', () => {
  const open = dd.classList.toggle('open')
  ddBtn.setAttribute('aria-expanded', String(open))
})
document.addEventListener('click', (e) => {
  if (dd && !dd.contains(e.target)) { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', 'false') }
})

// Filters (stories and resources)
const chips = document.querySelectorAll('.chip')
const cards = document.querySelectorAll('#story-grid .card')
const empty = document.getElementById('story-empty')
function apply(filter) {
  let shown = 0
  chips.forEach((c) => c.classList.toggle('on', c.dataset.filter === filter))
  cards.forEach((card) => {
    const ok = filter === 'all' || (card.dataset.tags || '').split('|').includes(filter)
    card.hidden = !ok
    if (ok) shown++
  })
  if (empty) empty.hidden = shown > 0
}
chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.filter)))
if (location.hash && document.querySelector(`.chip[data-filter="${location.hash.slice(1)}"]`)) apply(location.hash.slice(1))


// Interactives in reports
const fmtN = (n) => Math.round(n).toLocaleString('en-US')
document.querySelectorAll('.viz.widget').forEach((w) => {
  const kind = w.dataset.w
  const out = (k) => w.querySelector(`[data-o="${k}"]`)
  const rng = w.querySelector('input[type=range]')
  const say = w.querySelector('output')
  if (kind === 'shore') {
    const edge = w.querySelector('.edge'), land = w.querySelector('.land')
    const go = () => {
      const y = +rng.value, m = (500 / 30) * y
      const pos = 70 - (m / 500) * 55
      edge.style.left = land.style.width = pos + '%'
      say.textContent = y; out('m').textContent = fmtN(m) + ' m'
    }
    rng.addEventListener('input', go); go()
  }
  if (kind === 'loss') {
    const bar = w.querySelector('.meter i')
    const go = () => {
      const m = +rng.value, ha = (10000 / 12) * m
      bar.style.width = (m / 12) * 100 + '%'
      say.textContent = m; out('ha').textContent = fmtN(ha) + ' ha'
    }
    rng.addEventListener('input', go); go()
  }
  if (kind === 'yield') {
    const go = () => {
      const h = +rng.value, mx = 10000
      const set = (k, lo, hi) => {
        const e = w.querySelector(`[data-r="${k}"]`)
        e.style.left = (lo * h / mx) * 100 + '%'; e.style.width = Math.max(((hi - lo) * h / mx) * 100, 1.2) + '%'
        out(k).textContent = fmtN(lo * h) + ' to ' + fmtN(hi * h) + ' kg'
      }
      say.textContent = h; set('t', 100, 300); set('c', 800, 1000)
    }
    rng.addEventListener('input', go); go()
  }
  if (kind === 'rings') {
    const dots = w.querySelectorAll('.dots100 i'), btns = w.querySelectorAll('.seg button')
    const pick = (b) => {
      btns.forEach((x) => x.classList.toggle('on', x === b))
      dots.forEach((d, i) => d.classList.toggle('on', i < +b.dataset.n))
      out('t').textContent = b.dataset.t; out('p').textContent = b.dataset.p
    }
    btns.forEach((b) => b.addEventListener('click', () => pick(b))); pick(btns[0])
  }
  if (kind === 'tl') {
    const btns = w.querySelectorAll('.tl button'), ps = w.querySelectorAll('.tl-p p')
    btns.forEach((b, i) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('on', x === b)); ps.forEach((p, j) => (p.hidden = j !== i))
    }))
  }
  if (kind === 'tn') {
    const rows = JSON.parse(w.querySelector('.tn').dataset.rows), box = w.querySelector('.tn'), btns = w.querySelectorAll('.seg button')
    const draw = (s) => {
      box.innerHTML = rows.map(([n, a, b]) => {
        const keep = s === 'then' ? a : b
        const d = Array.from({ length: a }, (_, i) => `<i class="${i < keep ? '' : 'gone'}"></i>`).join('')
        return `<div class="r"><span>${n}</span><div class="d">${d}</div><b>${keep}</b></div>`
      }).join('')
      btns.forEach((x) => x.classList.toggle('on', x.dataset.s === s))
    }
    btns.forEach((b) => b.addEventListener('click', () => draw(b.dataset.s))); draw('then')
  }
  if (kind === 'plants') {
    const btns = w.querySelectorAll('.chips button'), box = out('u')
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('on', x === b))
      box.textContent = b.textContent + '. ' + (b.dataset.u || 'Listed in the research as an uncultivated plant. No specific use is recorded in this story.')
    }))
  }
})
