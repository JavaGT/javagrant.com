const name = localStorage.getItem('name')
if (!name || name == 'undefined') window.location = 'login'

const info = data[name.toLowerCase().split(' ').pop()] || data['basic']

window.addEventListener('load', ()=>{
  //Use custom name everywhere
  document.body.innerHTML = document.body.innerHTML.replace(/\$name/g, info.me.name || localStorage.getItem('name'));
  
  //Disable links
  setTimeout(()=>{
    ;[...document.querySelectorAll('a')].forEach(a=>{
      a.addEventListener('click', event=>{
        event.preventDefault()
      })
    })
  }, 200)

  //update friends names
  const friends = JSON.parse(info.friends)
  document.querySelector('#contactlist').innerHTML = friends.reduce((p, c)=>p + contactTempate(c), '')


  document.querySelector('#logout').addEventListener('click', ()=>{
    localStorage.setItem('name', undefined)
    document.location = 'login'
  })

  const birthdayfriend = friends[Math.floor((Math.random()*friends.length))]
  document.querySelector('#birthday').innerText = birthdayfriend.name
  document.querySelector('#birthdayimg').src = birthdayfriend.img

  ;[...document.querySelectorAll('.meimg')].forEach(e=>{
    e.src = info.me.img
    e.setAttribute("xlink:href", info.me.img)
  })

  if (info.advert) {
    document.querySelector('#ad1').src = info.advert.img;
    document.querySelector('#ad1txt').innerText = info.advert.text
    document.querySelector("#ad1txt2").innerText = info.advert.text2;
  }
})

function contactTempate(person){
  return `<li><div class=""><div><div data-visualcompletion="ignore-dynamic" style="padding-left: 8px; padding-right: 8px;"><a class="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 a8c37x1j mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l ue3kfks5 pw54ja7n uo3d90p7 l82x9zwi" href="https://www.facebook.com/messages/t/100000589979095/" role="link" tabindex="0"><div class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 nnctdnn4 hpfvmrgz qt6c0cv9 jb3vyjys l9j0dhe7 du4w35lb bp9cbjyn btwxx1t3 dflh9lhu scb9dxdr"><div class="nqmvxvec j83agx80 cbu4d94t tvfksri0 aov4n071 bi6gxh9e l9j0dhe7 m6uieof3 icc0peqn hx8drtub j13r6fgp nddp3pr2"><div class="q9uorilb l9j0dhe7 pzggbiyp du4w35lb"><svg aria-label="${person.name}" class="pzggbiyp" data-visualcompletion="ignore-dynamic" role="img" style="height: 36px; width: 36px;"><mask id="jsc_c_hp"><circle cx="18" cy="18" fill="white" r="18"></circle><circle cx="31" cy="31" data-visualcompletion="ignore" fill="black" r="6"></circle></mask><g mask="url(#jsc_c_hp)"><image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlink:href="${person.img}" style="height: 36px; width: 36px;"></image><circle class="mlqo0dh0 georvekb s6kb5r3f" cx="18" cy="18" r="18"></circle></g></svg><div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14" data-visualcompletion="ignore" style="bottom: 5px; right: 5px; transform: translate(50%, 50%);"><div class="l9j0dhe7 stjgntxs ni8dbmo4 j83agx80 spb7xbtv bkmhp75w emlxlaya s45kfl79"><div class="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t"><span class="pq6dq46d jllm4f4h qu0x051f esr5mh6w e9989ue4 r7d6kgcz s45kfl79 emlxlaya bkmhp75w spb7xbtv t6na6p9t c9rrlmt1" data-visualcompletion="ignore"></span><div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div></div></div></div></div></div><div class="ow4ym5g4 auili1gw rq0escxv j83agx80 buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz qt6c0cv9 rz4wbd8a a8nywdso jb3vyjys du4w35lb bp9cbjyn btwxx1t3 l9j0dhe7"><div class="gs1a9yip ow4ym5g4 auili1gw rq0escxv j83agx80 cbu4d94t buofh1pr g5gj957u i1fnvgqd oygrvhab cxmmr5t8 hcukyx3x kvgmc6g5 tgvbjcpo hpfvmrgz rz4wbd8a a8nywdso l9j0dhe7 du4w35lb rj1gh0hx pybr56ya f10w8fjw"><div class=""><div class="j83agx80 cbu4d94t ew0dbk1b irj2b8pg"><div class="qzhwtbm6 knvmm38d"><span class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql oi732d6d ik7dh3pa fgxwclzu a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d9wwppkn fe6kdd0r mau55g9w c8b282yb iv3no6db jq4qci2q a3bd9o3v ekzkrbhg oo9gr5id hzawbc8m" dir="auto">${person.name}</span></div></div></div></div></div></div><div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore"></div></a></div></div></div></li>`;
}
function roomTemplate(person){
  return `<!--$-->  <div aria-label="${person.name} friend room tile" class="oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 pq6dq46d mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l s45kfl79 emlxlaya bkmhp75w spb7xbtv qypqp5cg q676j6op" role="button" tabindex="0">  <span class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41">  <div>  <div class="q9uorilb l9j0dhe7 pzggbiyp du4w35lb">  <svg class="pzggbiyp" data-visualcompletion="ignore-dynamic" role="none" style="height:40px;width:40px">  <mask id="jsc_c_64">  <circle cx="20" cy="20" fill="white" r="20">  </circle>  <circle cx="34" cy="34" data-visualcompletion="ignore" fill="black" r="6.5">  </circle>  </mask>  <g mask="url(#jsc_c_64)">  <image style="height:40px;width:40px" x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%" xlink:href="${person.img}">  </image>  <circle class="mlqo0dh0 georvekb s6kb5r3f" cx="20" cy="20" r="20">  </circle>  </g>  </svg>  <div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv pmk7jnqg kavbgo14" data-visualcompletion="ignore" style="bottom: 6px; right: 6px; transform: translate(50%, 50%);">  <div class="l9j0dhe7 stjgntxs ni8dbmo4 j83agx80 spb7xbtv bkmhp75w emlxlaya s45kfl79">  <div class="iyyx5f41 l9j0dhe7 cebpdrjk bipmatt0 k5wvi7nf a8s20v7p k77z8yql qs9ysxi8 arfg74bv n00je7tq a6sixzi8 tojvnm2t">  <span class="pq6dq46d jllm4f4h qu0x051f esr5mh6w e9989ue4 r7d6kgcz s45kfl79 emlxlaya bkmhp75w spb7xbtv fz6q6hdd sx90ovx5" data-visualcompletion="ignore">  </span>  <div class="s45kfl79 emlxlaya bkmhp75w spb7xbtv i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore">  </div>  </div>  </div>  </div>  </div>  </div>  </span>  <div class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s" data-visualcompletion="ignore">  </div>  </div>  <!--/$-->`;
}