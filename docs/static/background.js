window.addEventListener('load', ()=>{
  const ctx = document.createElement('canvas').getContext('2d')
  document.body.appendChild(ctx.canvas)
  ctx.canvas.style = "z-index: -1; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;"
  // ctx.fillStyle = 'rgba(255,255,255,0.1)'
  // ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height)
  // setInterval(()=>{
  //   ctx.fillStyle = "rgba(255,255,255,0.1)";
  //   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   if (Math.random() < 0.3) {
  //   ctx.fillStyle = "rgba(0,0,0,0.05)";
  //   ctx.fillRect(
  //     Math.random() * ctx.canvas.width,
  //     Math.random() * ctx.canvas.height,
  //     Math.random() * 100,
  //     Math.random() * 100
  //   );
  //   }
  // }, 500)
})