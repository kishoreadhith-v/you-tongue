const form = document.querySelector('form');
const title = document.querySelector('#video-title');
const views = document.querySelector('#video-views');


form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = document.querySelector('#url').value;
  console.log(url);
  ipcRenderer.send('url', url);
});

ipcRenderer.on('video-info', (event, video) => {
  // console.log(video);
  title.textContent = video.title;
  views.textContent = video.views;
  likes.textContent = video.likes;
  dislikes.textContent = video.dislikes;
  // comments.textContent = video.comments;
  description.textContent = video.description;
})