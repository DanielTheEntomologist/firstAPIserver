import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Alert } from "reactstrap";
import { getSeats, loadSeats } from "../../../redux/seatsRedux";
import "./SeatChooser.scss";

import { io } from "socket.io-client";

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const URL =
      process.env.NODE_ENV === "production" ? undefined : "ws://localhost:8000";
    const socket = new io(URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
    setSocket(socket);

    socket.connect();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    socket.on("seatsUpdated", (data) => {
      dispatch(loadSeats(data));
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // useEffect(() => {
  //   dispatch(loadSeatsRequest());
  // }, []);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color="primary"
          className="seats__seat"
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <div className="mb-4">
        <small id="pickHelp" className="form-text text-muted ms-2">
          <Button color="secondary" /> – seat is already taken
        </small>
        <small id="pickHelpTwo" className="form-text text-muted ms-2">
          <Button outline color="primary" /> – it's empty
        </small>
      </div>

      {seats.length >= 0 && (
        <div className="seats">
          {[...Array(50)].map((x, i) => prepareSeat(i + 1))}
        </div>
      )}

      {seats.length === 0 && (
        <Alert color="warning">Couldn't load seats...</Alert>
      )}
    </div>
  );
};

export default SeatChooser;
