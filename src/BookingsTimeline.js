import React from "react";
import "./App.css";

const BookingsTimeline = ({ bookings, isNewBooking = false }) => {
  return (
    <>
      {isNewBooking ? <p>New Bookings:</p> : <p>Existing bookings:</p>}
      {isNewBooking && bookings.length > 0 && (
        <>
          Valid Bookings<span className="App-valid-indicator"></span>
          Overlapping Bookings<span className="App-invalid-indicator"></span>
        </>
      )}
      <section className="App-booking-container">
        {bookings.map((booking, i) => {
          const date = new Date(booking.time);
          const duration = booking.duration / (60 * 1000);
          return (
            <div
              key={i}
              className={
                isNewBooking
                  ? `App-new-booking ${
                      booking.isInvalid && "App-booking-invalid"
                    }`
                  : "App-booking"
              }
              style={{
                minWidth: `${Math.trunc(duration) / 1.5}px`,
                maxWidth: `${Math.trunc(duration) / 1.5}px`,
              }}
            >
              <span className="App-booking-time">{date.toString()}</span>
              <span className="App-booking-duration">
                {duration.toFixed(1)}
              </span>
              <span className="App-booking-user">{booking.userId}</span>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default BookingsTimeline;
