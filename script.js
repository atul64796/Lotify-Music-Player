
let currentsong = new Audio();
let songs;
let currfolder;
function convertSecondsToTimeFormat(seconds) {
  // Calculate minutes and remaining seconds for current time

  // Calculate total minutes and remaining seconds for total time
  const minutes = Math.floor(seconds / 60);
  const remaingSecond = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2,'0')
  const formattedSecond =String(remaingSecond).padStart(2,'0')
  // Format total time as 3:00 (minutes:seconds)
 

  // Return the formatted string as "current time / total time"
  return `${formattedMinutes}:${formattedSecond}`;
}

// Example usage:
const result = convertSecondsToTimeFormat(125, 180); // 125 seconds out of 180 total seconds
 // Output will be "05:02/03:00"


async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`); 
  let response = await a.text();

  // Log the response to see it
  let div = document.createElement("div"); 
  div.innerHTML = response; 

  let as = div.getElementsByTagName("a"); 
   songs = []; 

  // Loop through all anchor tags and check for .mp3 files
  for (let index = 0; index < as.length; index++) {
    const element = as[index]; 
    if (element.href.endsWith(".mp3")) { 
      songs.push(element.href.split(`/${folder}/`)[1]); 
    }
  }



  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
songUl.innerHTML = ""

  for (const song of songs) {
   songUl.innerHTML=songUl.innerHTML+`<li>
               <img class="invert " src="music.svg" alt="play">
                <div class="info">
                  <div> ${song.replaceAll("%20"," ")}</div>
                  <div>Atul</div>
                </div>
                <div class="play-now">
                  <span>Play Now</span>
                <img class="invert"  id="playn" src="play.svg" alt="play">
              </div>
  </li>`;
  }
//attach an event listener to each spng
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e)=>{
  e.addEventListener("click",()=>{
    playMusic(e.querySelector("div").firstElementChild.innerHTML.trim())
  })
})
  
return songs
}
const playMusic=(track,pause=false)=>{
  // let audio = new Audio("/songs/"+track)
  currentsong.src=`/${currfolder}/`+track;
  if(!pause){
  currentsong.play()
     play.src="pause.svg"
  }
   document.querySelector(".songinfo").innerHTML= decodeURI(track)
   document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function displayAlbums() {
  let a = await fetch(`/songs/`); 

  let response = await a.text();
  let div = document.createElement("div"); 
  div.innerHTML = response; 
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardContainer");

  // Fixed curly brackets and loop structure
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if (e.href.includes("/songs/")) {
  
      let folder = e.href.split("/").slice(-1)[0]

      // Get meta data
      let a = await fetch(`/songs/${folder}/info.json`); 
      let response = await a.json();

    
      
      // Append card HTML to cardcontainer
      cardcontainer.innerHTML = cardcontainer.innerHTML + `   
        <div class="card" data-folder="${folder}">
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="40px" viewBox="0 0 25 25" fill="#1fdf64">
              <!-- Green background with 50% border radius and padding -->
              <rect width="25" height="25" fill="#23ff06" rx="15" ry="13"/>
              <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="black" transform="scale(0.55) translate(10, 10)"/>
            </svg>                  
          </div>
          <img src="/songs/${folder}/cover.jpg" alt="" />
          <h2>${response.title}</h2>
          <p>${response.description}</p>
        </div>`
    }
  }

  // Event listener for each card
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      let songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}



async function main() {

await getsongs("songs/ak");
 
  playMusic(songs[0],true)

//display albums on the page

await displayAlbums()

  play.addEventListener("click",()=>{
    if(currentsong.paused){
      currentsong.play()
      play.src="pause.svg"
     
    
    }
    else{
      currentsong.pause()
      play.src="play.svg"
     
    }
  })
 
}



 currentsong.addEventListener("timeupdate",()=>{
 document.querySelector(".songtime").innerHTML=`${convertSecondsToTimeFormat(currentsong.currentTime)}/${convertSecondsToTimeFormat(currentsong.duration)}`
  document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration)*100 + "%"
  })
 
// seek bar > circle movement function
  document.querySelector(".seekbar").addEventListener("click",(e)=>{
let percent =(e.offsetX/e.target.getBoundingClientRect().width) *100
currentsong.currentTime=((currentsong.duration)*percent)/100
  })

// Call the main function
main();


// add event listener
let leftbox = document.querySelector(".left")
let hamburger = document.querySelector(".hamburger")
hamburger.addEventListener("click",()=>{
  leftbox.style.left="0";
})
//cross functionalty
let cross = document.querySelector(".cross")

cross.addEventListener("click",()=>{
  leftbox.style.left="-110%";
})

//previous button
previous.addEventListener("click",()=>{
  let index = songs.indexOf(currentsong.src.split("/").slice("-1")[0])
  if((index-1)>0){
    playMusic(songs[index-1])
    } })

// next button
next.addEventListener("click",()=>{
  currentsong.pause()
  let index = songs.indexOf(currentsong.src.split("/").slice("-1")[0])
  if((index+1)<songs.length){
  playMusic(songs[index+1])
  }
 })
 


document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  currentsong.volume =parseInt(e.target.value)/100
})


//add event listener to mute
document.querySelector(".volume > img").addEventListener("click",e=>{
if(e.target.src.includes("volume.svg")){
  e.target.src=e.target.src.replace("volume.svg","mute.svg")
  currentsong.volume = 0;
  document.querySelector(".range").getElementsByTagName("input")[0].value=0
}
else{
  e.target.src=  e.target.src.replace("mute.svg","volume.svg")

  currentsong.volume = .10;
  document.querySelector(".range").getElementsByTagName("input")[0].value=30;
}
})
  
