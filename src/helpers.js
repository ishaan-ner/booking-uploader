// series of helper functions to format date-time data for bookings

export const sortByDate = (bookings = []) => {
  const data = [...bookings]; // prevent mutation
  return data.sort((a, b) => new Date(a.time) - new Date(b.time));
};

export const convertDurationsToMilliseconds = (bookings = []) => {
  return bookings.map((booking) => ({
    ...booking,
    duration: parseInt(booking.duration) * 60000,
  }));
};

export const createTimeStampedBookings = (bookings = []) => {
  return bookings.map((booking) => {
    const duration = parseInt(booking.duration);
    const start = new Date(booking.time);
    const timeStamp = {
      start,
      end: new Date(start.getTime() + duration),
    };
    return { ...booking, ...timeStamp };
  });
};

const checkOverlaps = (existingBooking, newBooking) => {
  const isBefore =
    existingBooking.start <= newBooking.start &&
    existingBooking.end > newBooking.start;
  const isAfter =
    existingBooking.start <= newBooking.end &&
    existingBooking.end > newBooking.end;
  const totalOverlap =
    existingBooking.start <= newBooking.start &&
    existingBooking.end > newBooking.end;
  return isBefore || isAfter || totalOverlap;
};

export const markOverlappingBookings = (
  newBookings = [],
  existingBookings = []
) => {
  return newBookings.map((newBooking) => {
    const isOverlap = existingBookings.some((existingBooking) => {
      return checkOverlaps(existingBooking, newBooking);
    });
    if (isOverlap) {
      return { ...newBooking, isInvalid: true };
    }
    return { ...newBooking };
  });
};
