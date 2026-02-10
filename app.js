// LINKS ANIMATION
const links = document.querySelectorAll("a");

links.forEach(link => {
  let fullyIn = false;
  let isHovered = false;

  link.addEventListener("mouseenter", () => {
    if (isHovered) return;
    isHovered = true;

    link.classList.remove("exit");
    link.classList.add("animate");
    fullyIn = false;
  });

  link.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (isHovered && link.classList.contains("animate")) {
      fullyIn = true;
    }

    if (link.classList.contains("exit") && !isHovered) {
      link.classList.remove("exit");
      fullyIn = false;
    }
  });

  link.addEventListener("mouseleave", () => {
    isHovered = false;

    if (!fullyIn) {
      link.classList.remove("animate");
      return;
    }

    link.classList.remove("animate");
    link.classList.add("exit");
    fullyIn = false;
  });
});

// MOUSE TRAIL

  const svg = document.querySelector('#trail')
  const path = svg.querySelector('path')
  
  let points = []
  let segments = 30 // trail length
  let mouse = {
    x: 0,
    y: 0,
  }
  
  const move = (event) => {
    const x = event.clientX
    const y = event.clientY
  
    mouse.x = x
    mouse.y = y
  
    if (points.length === 0) {
      for (let i = 0; i < segments; i++) {
        points.push({
          x: x,
          y: y,
        })
      }
    }
  }
  
  const anim = () => {

    let px = mouse.x
    let py = mouse.y
  
    points.forEach((p, index) => {
      p.x = px
      p.y = py
  
      let n = points[index + 1]
  
      if (n) {
        px = px - (p.x - n.x) * 0.6
        py = py - (p.y - n.y) * 0.6
      }
    })
  
    path.setAttribute('d', `M ${points.map((p) => `${p.x} ${p.y}`).join(` L `)}`)
  
    requestAnimationFrame(anim)
  }
  
  const resize = () => {
    const ww = window.innerWidth
    const wh = window.innerHeight
  
    svg.style.width = ww + 'px'
    svg.style.height = wh + 'px'
    svg.setAttribute('viewBox', `0 0 ${ww} ${wh}`)
  }
  
  document.addEventListener('mousemove', move)
  window.addEventListener('resize', resize)
  
  anim()
  resize()

// SCROLLBAR

const thumb = document.getElementById("scrollbarProgress");
function update() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const pct = (scrollY / max) * 100;
  thumb.style.width = pct + "%";
}
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
update();

// SHARE

(() => {
  const btn = document.getElementById("shareButton");
  if (!btn) return;

  const getShareData = () => {
    const url = window.location.href;
    return {
      title: document.title,
      text: "Check this out:",
      url
    };
  };

  const copyFallback = async (text) => {

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {}

    return false;
  };

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const data = getShareData();
    const urlToCopy = data.url;

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
        await navigator.share(data);
        return;
      }
    } catch (_) {
    }

    const copied = await copyFallback(urlToCopy);

    const original = btn.textContent;
    btn.textContent = copied ? "Link copied" : "Send Privacy";
    setTimeout(() => (btn.textContent = original), 1200);

    if (!copied) {
      window.open(urlToCopy, "_blank", "noopener,noreferrer");
    }
  }, { passive: false });
})();
