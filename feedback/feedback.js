const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const drawer = document.getElementById("myDrawer");
const login =document.getElementById("login")

if (localStorage.getItem("CurrentUser")==null)
    window.location.href = '/login/login.html';

closeBtn.addEventListener('click', function(){
    drawer.classList.remove('open')
});

openBtn.addEventListener('click', function(){
    drawer.classList.toggle('open');
});

login.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('CurrentUser');
    window.location.href = '/login/login.html';
});





const send = document.getElementById("Feedback");

send.addEventListener('submit', function(event) {
      event.preventDefault(); 

      const form = event.target;
      const data = new FormData(form);
      const status = document.getElementById('userfeedback');

      fetch('https://formspree.io/f/xjkwynbp', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
      .then(response => {
        if (response.ok) {
          status.textContent = 'Feedback sent successfully!';
          status.classList.remove('error');
          form.reset();
        } else {
          response.json().then(data => {
            status.textContent = data.errors?.[0]?.message || 'Submission error.';
            status.classList.add('error');
          });
        }

        setTimeout(() => {
          status.textContent = '';
          status.classList.remove('error');
        }, 3000);
      })
      .catch(error => {
        status.textContent = 'Network error.';
        status.classList.add('error');

        setTimeout(() => {
          status.textContent = '';
          status.classList.remove('error');
        }, 3000);
      });
    });