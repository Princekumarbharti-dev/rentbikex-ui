# RentBikeX

RentBikeX is a responsive, browser-based bike and scooter rental experience. Browse the fleet, choose rental dates, enter renter details, and receive a local booking reference without needing a backend service.

## Live demo

The site is deployed with GitHub Pages:

**[Open the RentBikeX demo](https://Princekumarbharti-dev.github.io/cityride-bike-rentals/)**

## Full demo flow

1. Browse the fleet from the homepage.
2. Select **Rent Now** on any vehicle.
4. Choose pickup and return dates.
5. Enter contact details and review the calculated total.
6. Confirm the reservation to receive a booking reference.
6. Visit the About and Contact pages from the navigation.

Bookings are stored in the browser's local storage for this static demo. No payment is processed and no personal data is sent to a server.

## Built with

- HTML5 and accessible semantic markup
- CSS3 with responsive layouts and custom visual styling
- Bootstrap 5.3 for layout utilities and carousel behavior
- Vanilla JavaScript for filtering, validation, price calculation, modal booking, and local persistence
- GitHub Actions and GitHub Pages for deployment

## Run locally

Because this is a static site, any local web server will work:

```powershell
python -m http.server 5500
```

Open `http://localhost:5500` in a browser. Opening `index.html` directly also works, but a local server is recommended for consistent asset loading.

## Production roadmap

The current release is a complete frontend demonstration. A production rental platform would connect the booking form to an API for authentication, vehicle availability, payment processing, staff management, and reservation persistence.
