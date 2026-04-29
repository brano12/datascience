const OpenedDoc = window.location.href.split("/").pop().slice(0, -5)

const LeftPanelBttns = Array.from(document.getElementsByClassName('left-panel')[0].children)
const OpenedIMG = document.getElementsByClassName('main-img')[0]
const PrevBtn = document.getElementsByClassName('main-panel-buttons')[0]
const NextBtn = document.getElementsByClassName('main-panel-buttons')[1]

OpenedIMG.src = `${OpenedDoc}/${LeftPanelBttns[0].innerText} 1.png`


function imageExists(url) {

  return new Promise((resolve) => {

    const img = new Image();
    img.onload = () => resolve(true); // image loaded → exists
    img.onerror = () => resolve(false); // failed → doesn't exist
    img.src = url;
  });
}

async function indexSearch(indx,condition, categ) {
  do {
    indx += 1;
    const exists = await imageExists(`${OpenedDoc}/${categ} ${indx}.png`);

    if (exists === condition) {
      break;
    }
  } while (true);
  return indx;
}


LeftPanelBttns.forEach(button => {

  button.addEventListener("click", async () => {

    let index = await indexSearch(0, true, button.innerText);
    OpenedIMG.src = `${OpenedDoc}/${button.innerText} ${index}.png`

  });
});


async function findPrevIMG(url, index, category) {
  const exists = await imageExists(url);

  if (exists) {
    OpenedIMG.src = url;

  } else {
    let btnIndx = LeftPanelBttns.findIndex(item => item.innerText === category);

    //checking whether we are not at the beginning of the slide show - first LeftPanelBttns category
    if (btnIndx == 0) {
      category = LeftPanelBttns[LeftPanelBttns.length - 1].innerText;
      //we will switch to highest category - last LeftPanelBttn
      //and we need to find lowest and then highest index of highest category
      index = await indexSearch(0, true, category)
      index = await indexSearch(index, false, category)
      index = index-1;

    } else {
      category = LeftPanelBttns[btnIndx - 1].innerText;
    }
      OpenedIMG.src = `${OpenedDoc}/${category} ${index}.png`
  }
}


PrevBtn.addEventListener("click", () =>{
  let openedIMGstring = OpenedIMG.src.split("/").pop().slice(0,-4);
  let openedIMGArray =  openedIMGstring.split("%20");
  let category = openedIMGArray[0];
  let index = openedIMGArray[1];
  index -= 1;

  findPrevIMG(`${OpenedDoc}/${category} ${index}.png`, index, category)
});


async function findNextIMG(url, index, category) {
  const exists = await imageExists(url);

  if(exists){
      OpenedIMG.src = url;

  } else {
    let btnIndx = LeftPanelBttns.findIndex( item =>item.innerText === category);
    //checking whether we are not at the end of the slide show - last LeftPanelBttns category
    if(LeftPanelBttns.length == (btnIndx+1)){
      category = LeftPanelBttns[0].innerText;
      index = 1;
    }else{
      category = LeftPanelBttns[btnIndx+1].innerText;
    }

    OpenedIMG.src = `${OpenedDoc}/${category} ${index}.png`
  }
}

NextBtn.addEventListener("click", () =>{
  let openedIMGstring = OpenedIMG.src.split("/").pop().slice(0,-4);
  let openedIMGArray =  openedIMGstring.split("%20");
  let category = openedIMGArray[0];
  let index = Number(openedIMGArray[1]);
  index += 1;

  findNextIMG(`${OpenedDoc}/${category} ${index}.png`, index, category)
});
