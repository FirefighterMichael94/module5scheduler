document.addEventListener('DOMContentLoaded', function () {
  // Display the current day at the top of the calendar
  document.getElementById('currentDay').textContent = moment().format('dddd, MMMM Do YYYY');

  // Generate timeblocks for 9am to 5pm
  for (let hour = 9; hour <= 17; hour++) {
      createAndAppendTimeblock(hour);
  }

  // Check and set the color code for each timeblock
  updateColorCode();

  // Load saved events from local storage
  loadEvents();

  // Event listener for save button click
  document.addEventListener('click', function (event) {
      if (event.target.classList.contains('saveBtn')) {
          saveEvent(event.target);
      }
  });

  // Event listener for textarea input to update color
  document.addEventListener('input', function (event) {
      if (event.target.classList.contains('description')) {
          updateColorCode();
      }
  });
});

function createAndAppendTimeblock(hour) {
  const timeblocksSection = document.getElementById('timeblocks');
  const timeblock = document.createElement('div');
  const saveButton = document.createElement('button');

  timeblock.classList.add('row', 'time-block');
  timeblock.id = `hour-${hour}`;
  saveButton.classList.add('btn', 'saveBtn');
  saveButton.setAttribute('aria-label', 'save');
  saveButton.innerHTML = '<i class="fas fa-save"></i>';

  timeblock.innerHTML = `
      <div class="col-2 col-md-1 hour text-center py-3">${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}</div>
      <textarea class="col-8 col-md-10 description" rows="3"></textarea>
  `;

  timeblock.appendChild(saveButton);
  timeblocksSection.appendChild(timeblock);
}

function updateColorCode() {
  const currentHour = moment().hour();

  document.querySelectorAll('.time-block').forEach(function (timeblock) {
      const timeblockHour = parseInt(timeblock.id.split('-')[1]);
      const description = timeblock.querySelector('.description');
      const eventTime = moment(description.value, 'h:mm A');

      if (eventTime.isValid()) {
          if (eventTime.isSame(moment(), 'day')) {
              if (eventTime.isAfter(moment())) {
                  timeblock.classList.remove('past', 'present', 'future');
                  timeblock.classList.add('future');
              } else {
                  timeblock.classList.remove('past', 'present', 'future');
                  timeblock.classList.add('past');
              }
          } else {
              timeblock.classList.remove('past', 'present', 'future');
              timeblock.classList.add('future');
          }
      } else {
          if (timeblockHour < currentHour) {
              timeblock.classList.remove('past', 'present', 'future');
              timeblock.classList.add('past');
          } else if (timeblockHour === currentHour) {
              timeblock.classList.remove('past', 'present', 'future');
              timeblock.classList.add('present');
          } else {
              timeblock.classList.remove('past', 'present', 'future');
              timeblock.classList.add('future');
          }
      }
  });
}

function saveEvent(saveBtn) {
  const timeblock = saveBtn.parentElement;
  const eventText = timeblock.querySelector('.description').value;

  localStorage.setItem(`event-${timeblock.id}`, eventText);
}

function loadEvents() {
  document.querySelectorAll('.time-block').forEach(function (timeblock) {
      const savedEvent = localStorage.getItem(`event-${timeblock.id}`);

      if (savedEvent) {
          timeblock.querySelector('.description').value = savedEvent;
      }
  });
}
