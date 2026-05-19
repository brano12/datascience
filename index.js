const openedDoc = window.location.href.split("/").pop().slice(0, -5);
const pageNumber = document.querySelector('.page-number');
const leftPanelBttns = Array.from(document.getElementsByClassName('left-panel')[0].children);
const openedIMG = document.querySelector('.main-img');
const prevBtn = document.getElementsByClassName('main-panel-buttons')[0];
const nextBtn = document.getElementsByClassName('main-panel-buttons')[1];

openedIMG.src = `${openedDoc}/${leftPanelBttns[0].innerText.toLowerCase()} 1.png`;

function prepareImageString(filename) {

  let openedIMGstring = filename.split("/").pop().slice(0,-4);
  let openedIMGArray =  openedIMGstring.split("%20");

  if (openedIMGArray.length == 1) {
    openedIMGArray =  openedIMGstring.split(" ");
  }

  let category = "";
  let index;

  openedIMGArray.forEach(item => {
    if(!Number(item)){
      category = category + " " + item;
    }
  });

  category = category.trim()
  index = Number(openedIMGArray[openedIMGArray.length - 1]);
  return [category, index];
}

pageNumber.innerText = prepareImageString(openedIMG.src)[0] + " pg." + prepareImageString(openedIMG.src)[1]




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
    const exists = await imageExists(`${openedDoc}/${categ} ${indx}.png`);

    if (exists === condition) {
      break;
    }
  } while (indx < 200);
  return indx;
}


leftPanelBttns.forEach(button => {

  button.addEventListener("click", async () => {

    let index = await indexSearch(0, true, button.innerText.toLowerCase());
    openedIMG.src = `${openedDoc}/${button.innerText.toLowerCase()} ${index}.png`;
    pageNumber.innerText = prepareImageString(openedIMG.src)[0] + " pg." + prepareImageString(openedIMG.src)[1]
  });
});


async function categoryCheck(category, index, direction){

    let btnIndx = leftPanelBttns.findIndex(item => item.innerText.toLowerCase() === category);

      //checking whether we are not at the beginning of the slide show - first LeftPanelBttns category
    if (btnIndx == 0 && index == 0 && direction == -1) {

      category = leftPanelBttns[leftPanelBttns.length - 1].innerText.toLowerCase();
      //we will switch to highest category - last LeftPanelBttn
      //and we need to find lowest and then highest index of highest category
      index = await indexSearch(0, true, category)
      index = await indexSearch(index, false, category)
      index = index-1;
    }

  //checking whether we are not at the end of the slide show - last LeftPanelBttns category
    else if (leftPanelBttns.length == (btnIndx+1) && direction == 1) {

      category = leftPanelBttns[0].innerText.toLowerCase();
      index = 1;
    } else {
      category = leftPanelBttns[btnIndx + direction].innerText.toLowerCase();

      }

    return [category, index];
}


async function findIMG(category, index, direction) {

  const exists = await imageExists(`${openedDoc}/${category} ${index}.png`);

  if (!exists) {
    let catIndxArray = await categoryCheck(category, index, direction);

    return catIndxArray;
  }

  return [category, index];
}



// direction PREVIOUS is represented with value -1 and NEXT with 1
prevBtn.addEventListener("click", async () =>{

  category = prepareImageString(openedIMG.src)[0] ;
  index = prepareImageString(openedIMG.src)[1] - 1;

  let findIMGarray = await findIMG(category, index, -1)

  openedIMG.src = `${openedDoc}/${findIMGarray[0]} ${findIMGarray[1]}.png`;
  pageNumber.innerText = findIMGarray[0] + " pg." + findIMGarray[1]
});


nextBtn.addEventListener("click", async () =>{

  category = prepareImageString(openedIMG.src)[0] ;
  index = prepareImageString(openedIMG.src)[1] + 1;

  let findIMGarray = await findIMG(category, index, 1)

  openedIMG.src = `${openedDoc}/${findIMGarray[0]} ${findIMGarray[1]}.png`;
  pageNumber.innerText = findIMGarray[0] + " pg." + findIMGarray[1]
});
