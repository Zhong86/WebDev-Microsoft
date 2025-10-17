function dragElement(terEl) {
  let pos1 = 0, 
    pos2 = 0,
    pos3 = 0, 
    pos4 = 0; 

  const rect = terEl.getBoundingClientRect(); 
  terEl.topView = rect.top; 
  terEl.leftView = rect.left; 
  terEl.originalSize = {
    width: terEl.offsetWidth, 
    height: terEl.offsetHeight
  };

  terEl.onpointerdown = pointerDrag; 

  function pointerDrag(e) {
    e.preventDefault(); 
    console.log(e); 
    pos3 = e.clientX; 
    pos4 = e.clientY; 
    document.onpointermove = elementDrag; 
    document.onpointerup = stopElementDrag;
  }

  function elementDrag(e) {
    pos1 = pos3 - e.clientX; 
    pos2 = pos4 - e.clientY; 
    pos3 = e.clientX; 
    pos4 = e.clientY; 
    terEl.style.top = terEl.offsetTop - pos2 + 'px'; 
    terEl.style.left = terEl.offsetLeft - pos1 + 'px'; 
  }

  function stopElementDrag() {
    document.onpointerup = null; 
    document.onpointermove = null; 
  }

  return terEl; 
}

function reset(resetBtn) {
  let terEls = [];
  for (let i = 1; i<= 14; i++) {
    let terEl = document.getElementById(`plant${i}`);
    if(terEl) {
      terEls.push(dragElement(terEl));
    }
  }

  resetBtn.addEventListener('click', () => {
    resetBtn.disabled = true; 

    terEls.forEach(terEl => {
      const bodyRect = terEl.getBoundingClientRect(); 

      terEl.style.transition = ''; 
      terEl.style.transform = ''; 
      terEl.style.position = 'fixed'; 
      terEl.style.zIndex = 2; 
      terEl.style.width = `${terEl.originalSize.width}px`;
      terEl.style.height = `${terEl.originalSize.height}px`;
      terEl.style.left = `${bodyRect.left}px`;
      terEl.style.top = `${bodyRect.top}px`;
      
      void terEl.offsetWidth;       
      terEl.style.transition = 'left 1s ease, top 1s ease';
      
      terEl.style.left = `${terEl.leftView}px`;
      terEl.style.top = `${terEl.topView}px`;

      terEl.style.transform = ''; 

      const onTransitionEnd = (ev) => {
        terEl.removeEventListener('transitionend', onTransitionEnd); 

        terEl.style.transition = ''; 
        resetBtn.disabled = false; 
      };
      terEl.addEventListener('transitionend', onTransitionEnd);
    }); 
  }); 
}

//dragElement(document.getElementById('plant1'));
//dragElement(document.getElementById('plant2'));
//dragElement(document.getElementById('plant3'));
//dragElement(document.getElementById('plant4'));
//dragElement(document.getElementById('plant5'));
//dragElement(document.getElementById('plant6'));
//dragElement(document.getElementById('plant7'));
//dragElement(document.getElementById('plant8'));
//dragElement(document.getElementById('plant9'));
//dragElement(document.getElementById('plant10'));
//dragElement(document.getElementById('plant11'));
//dragElement(document.getElementById('plant12'));
//dragElement(document.getElementById('plant13'));
//dragElement(document.getElementById('plant14'));
reset(document.getElementById('reset-btn'));
