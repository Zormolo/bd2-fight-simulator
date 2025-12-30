/** @type { HTMLCanvasElement } */
const canvas = getHTMLElement( 'bossDisplay' );
const ctx = canvas.getContext( "2d" );

/** @type { HTMLSelectElement } */
const bossSelect = getHTMLElement( 'bossSelect' );

let bossData = null;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function grid() {
  const columns = 4;
  const rows = 3;

  const size = 128;
  const gap = 10;

  const startX = canvas.width / 2 - ( 1.5 * gap + 2 * size );
  const startY = canvas.height - ( 4 * gap + 3 * size );

  const images = [];

  const empytSlot = new Image();
  empytSlot.src = "./../public/images/emptySlot.png";

  images.push( empytSlot );

  for( const part of bossData[ bossSelect.value ].parts ) {
    const img = new Image();
    img.src = `./public/images/fh/${ bossSelect.value }/${ part }.png`;
    images.push( img );
  }

  Promise.all( images.map( i => new Promise( res => i.onload = res) ) ).then( () => {
    console.log('all loaded')
    let index = 0;

    const partArray = bossData[ bossSelect.value ].parts;
    for( let row = 0; row < rows; row++ ) {
      for( let column = 0; column < columns; column++ ) {
        const x = startX + column * ( size + gap );
        const y = startY + row * ( size + gap );
        console.log(row, column)
        if( partArray.includes( index ) ) {
          ctx.drawImage(images[ 1 ], x, y, size, size );
          images.splice( 1, 1);
        } else {
          ctx.drawImage(images[ 0 ], x, y, size, size );
        }
        console.log(index)
        index++;
      }
    }
  } )
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid();
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getHTMLElement( id ) {
  if ( typeof id !== 'string' ) {
    throw new Error( 'HTMLElement-Id is not a string' );
  }
  const element = document.getElementById( id );
  if ( !element ) {
    throw new Error( `"${ id }" is not defined as HTMLElement-Id on this page` );
  }
  return element;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function resizeCanvas() {
  const dpi = window.devicePixelRatio || 1;

  // get CSS size
  const styleWidth  = canvas.clientWidth;
  const styleHeight = canvas.clientHeight;

  // set internal pixel size
  canvas.width  = styleWidth  * dpi;
  canvas.height = styleHeight * dpi;

  // reset transform and scale for DPI
  ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
}
window.addEventListener("resize", resizeCanvas);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function init() {
  const res = await fetch( "./public/json/bossData.json" );
  bossData = await res.json();

  bossSelect.addEventListener( 'change', draw );
  resizeCanvas();
  draw();
  console.log(bossData)
}
init();