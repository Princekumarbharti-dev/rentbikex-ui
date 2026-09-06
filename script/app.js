const bookingKey = 'cityride_booking';

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

function openBooking(vehicle) {
  const existing = document.querySelector('#booking-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'booking-modal';
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button class="modal-close" type="button" aria-label="Close booking form">&times;</button>
      <span class="eyebrow">RESERVE YOUR RIDE</span>
      <h2 id="booking-title">${vehicle.name}</h2>
      <p class="booking-rate">${formatCurrency(vehicle.rate)} per day · ${vehicle.type}</p>
      <form id="booking-form">
        <div class="date-grid">
          <label>Pickup date<input required type="date" name="pickup" min="${new Date().toISOString().split('T')[0]}"></label>
          <label>Return date<input required type="date" name="return"></label>
        </div>
        <label>Full name<input required type="text" name="name" placeholder="Your name"></label>
        <label>Email address<input required type="email" name="email" placeholder="you@example.com"></label>
        <label>Phone number<input required type="tel" name="phone" placeholder="10-digit phone number"></label>
        <div class="booking-total"><span>Estimated total</span><strong id="booking-total">Select dates</strong></div>
        <button class="btn btn-primary w-100" type="submit">Confirm reservation <i class="fa-solid fa-arrow-right ms-2"></i></button>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const form = modal.querySelector('form');
  const firstField = form.elements.pickup;
  const pickup = form.elements.pickup;
  const returnDate = form.elements.return;
  const total = modal.querySelector('#booking-total');
  const updateTotal = () => {
    const start = new Date(pickup.value);
    const end = new Date(returnDate.value);
    const days = Math.ceil((end - start) / 86400000) + 1;
    total.textContent = Number.isFinite(days) && days > 0 ? `${formatCurrency(days * vehicle.rate)} · ${days} day${days === 1 ? '' : 's'}` : 'Select valid dates';
  };
  pickup.addEventListener('change', () => { returnDate.min = pickup.value; updateTotal(); });
  returnDate.addEventListener('change', updateTotal);
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.remove(); });
  modal.addEventListener('keydown', (event) => { if (event.key === 'Escape') modal.remove(); });
  firstField.focus();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const days = Math.ceil((new Date(data.return) - new Date(data.pickup)) / 86400000) + 1;
    if (days < 1) {
      returnDate.setCustomValidity('Return date must be on or after the pickup date.');
      returnDate.reportValidity();
      return;
    }
    returnDate.setCustomValidity('');
    const reference = `CR-${Date.now().toString().slice(-6)}`;
    localStorage.setItem(bookingKey, JSON.stringify({ ...data, vehicle: vehicle.name, total: days * vehicle.rate, reference }));
    modal.querySelector('.booking-panel').innerHTML = `<button class="modal-close" type="button" aria-label="Close booking confirmation">&times;</button><div class="success-mark"><i class="fa-solid fa-check"></i></div><span class="eyebrow">RESERVATION CONFIRMED</span><h2>You are all set, ${data.name.split(' ')[0]}.</h2><p>Your ${vehicle.name} is reserved from ${data.pickup} to ${data.return}.</p><div class="reference-code">Booking reference <strong>${reference}</strong></div><button class="btn btn-primary w-100" type="button" data-close>Done</button>`;
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
  });
}

document.querySelectorAll('.vehicle-card').forEach((card) => {
  const button = card.querySelector('.btn-primary');
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const title = card.querySelector('.card-title').textContent.trim();
    const rate = Number(card.querySelector('.card-text').textContent.replace(/[^0-9]/g, ''));
    button.setAttribute('aria-label', `Rent ${title}`);
    openBooking({ name: title, rate, type: card.dataset.category });
  });
});

document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.vehicle-card').forEach((card) => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
