const form = document.querySelector('form');
const title = document.getElementById('video-title');
const views = document.getElementById('video-views');
const author = document.getElementById('video-author');
const videoInfoContainer = document.getElementsByClassName('video-info-container')[0];
const playButton = document.createElement('button');

let url = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  url = document.querySelector('#url').value;
  console.log(url);
  ipcRenderer.send('url', url);
});

ipcRenderer.on("video-info", (event, vid) => {
  const video = event;

  title.textContent = video.title;
  views.textContent = video.views;
  author.textContent = video.author;
  playButton.textContent = 'Play Video';
  playButton.classList.add('play-button');
  videoInfoContainer.appendChild(playButton);
})

playButton.addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('play-video', url);
})