const form = document.querySelector('form');
const title = document.getElementById('video-title');
const views = document.getElementById('video-views');
const author = document.getElementById('video-author');


form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = document.querySelector('#url').value;
  console.log(url);
  ipcRenderer.send('url', url);
});

ipcRenderer.on("video-info", (event, vid) => {
  const video = event;

  title.textContent = video.title;
  views.textContent = video.views;
  author.textContent = video.author;
})