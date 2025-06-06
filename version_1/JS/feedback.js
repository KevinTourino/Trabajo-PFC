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