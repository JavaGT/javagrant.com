window.addEventListener('load', ()=>{
  const ctx = document.createElement('canvas').getContext('2d')
  document.body.appendChild(ctx.canvas)
  ctx.canvas.style = "z-index: -1; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;"
  ctx.canvas.width = 1920;
  ctx.canvas.height = 1080;
})