import React, { useState, useEffect, useCallback } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import "./App.css";
import BookingsTimeline from "./BookingsTimeline";
import {
  convertDurationsToMilliseconds,
  createTimeStampedBookings,
  markOverlappingBookings,
  sortByDate,
} from "./helpers";
import axios from "axios";

const apiUrl = "http://localhost:3001";

export const App = () => {
  const [existingBookings, setExistingBookings] = useState([]);
  const [newBookings, setNewBookings] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((result) => {
        const timeStampedBookings = createTimeStampedBookings(result);
        setExistingBookings(timeStampedBookings);
      });
  }, []);

  const saveBookings = async () => {
    const validBookings = newBookings
      .filter((booking) => !booking.isInvalid)
      .map((booking) => ({
        time: booking.time,
        duration: booking.duration,
        userId: booking.userId,
      }));
    try {
      const response = await axios.post(`${apiUrl}/bookings`, {
        bookings: validBookings,
      });
      const timeStampedBookings = createTimeStampedBookings(response.data);
      setExistingBookings(timeStampedBookings);
      setNewBookings([]);
    } catch (error) {
      console.log(error);
    }
  };

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      delimiter: ", ",
      skipEmptyLines: true,
      complete: (results) => {
        const sortedBookings = sortByDate(results.data);
        const formattedBookings =
          convertDurationsToMilliseconds(sortedBookings);
        const timeStampedBookings =
          createTimeStampedBookings(formattedBookings);
        const markedBookings = markOverlappingBookings(
          timeStampedBookings,
          existingBookings
        );
        setNewBookings(markedBookings);
      },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length) {
        parseFile(acceptedFiles[0]);
      }
    },
    [existingBookings]
  );

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone
          accept=".csv"
          onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="App-main">
        <BookingsTimeline bookings={existingBookings} />
        <BookingsTimeline bookings={newBookings} isNewBooking={true} />
        {newBookings.length ? (
          <button className="App-save-button" onClick={saveBookings}>
            Save Valid Bookings
          </button>
        ) : null}
      </div>
    </div>
  );
};
