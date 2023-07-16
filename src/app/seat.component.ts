import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css'],
})
export class SeatComponent implements OnInit {
  totalSeats = 80;
  seatsPerRow = 7;
  lastRowSeats = 3;
  rows: { seats: number[] }[] = [];
  numSeats: number;

  ngOnInit(): void {
    this.generateSeats();
  }

  generateSeats(): void {
    const rows = Math.ceil(this.totalSeats / this.seatsPerRow);
    for (let row = 0; row < rows; row++) {
      const seatsInRow = row < rows - 1 ? this.seatsPerRow : this.lastRowSeats;
      const seats = new Array(seatsInRow).fill(0);
      this.rows.push({ seats });
    }
  }

  bookSeats(): void {
    let seatsToBook = this.numSeats;
    let bookedSeats: number[] = [];

    // Helper function to check if a seat is available
    const isSeatAvailable = (row: number, seat: number): boolean => {
      return this.rows[row].seats[seat] === 0;
    };

    // Check if the number of seats available is less than the number of seats to be booked
    const totalAvailableSeats = this.rows.reduce(
      (total, row) => total + row.seats.filter((seat) => seat === 0).length,
      0
    );
    if (totalAvailableSeats < seatsToBook) {
      alert(
        `Only ${totalAvailableSeats} seat(s) available. Cannot book ${seatsToBook} seat(s).`
      );
      return; // Exit the function
    }

    // Search for consecutive seats in different rows
    for (let row = 0; row < this.rows.length; row++) {
      let consecutiveSeats: number[] = [];

      for (let seat = 0; seat < this.rows[row].seats.length; seat++) {
        if (isSeatAvailable(row, seat)) {
          consecutiveSeats.push(row * this.seatsPerRow + seat + 1);
        } else {
          consecutiveSeats = [];
        }

        if (consecutiveSeats.length === seatsToBook) {
          bookedSeats = bookedSeats.concat(consecutiveSeats);
          consecutiveSeats.forEach((seatNum) => {
            const rowIndex = Math.floor((seatNum - 1) / this.seatsPerRow);
            const seatIndex = (seatNum - 1) % this.seatsPerRow;
            this.rows[rowIndex].seats[seatIndex] = 1; // Book the seat
          });
          break;
        }
      }

      if (bookedSeats.length === this.numSeats) {
        break;
      }
    }

    // If enough consecutive seats are not found, allocate nearest seats
    if (bookedSeats.length < this.numSeats) {
      for (let row = 0; row < this.rows.length; row++) {
        for (let seat = 0; seat < this.rows[row].seats.length; seat++) {
          if (isSeatAvailable(row, seat)) {
            bookedSeats.push(row * this.seatsPerRow + seat + 1);
            this.rows[row].seats[seat] = 1; // Book the seat

            if (bookedSeats.length === this.numSeats) {
              break;
            }
          }
        }

        if (bookedSeats.length === this.numSeats) {
          break;
        }
      }
    }

    if (bookedSeats.length > 0) {
      console.log(
        `Successfully booked ${this.numSeats} seats: ${bookedSeats.join(', ')}.`
      );
    } else {
      console.log(`Seats not available for booking ${this.numSeats} seats.`);
    }

    // Update the view after booking
    setTimeout(() => {
      this.updateView();
    }, 0);

    // Clear the input field after booking
    this.numSeats = null;
  }
  updateView(): void {
    // Update the view to reflect the changes in seat colors
    this.rows = [...this.rows];
  }

  scrollToSeat(rowIndex: number, seatIndex: number): void {
    const element = document.getElementById(`seat-${rowIndex}-${seatIndex}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }

  checkAvailability(numSeats: number, startSeat: number): boolean {
    const seats = this.rows.flatMap((row) =>
      row.seats.slice(startSeat, startSeat + numSeats)
    );
    return seats.every((seat) => seat === 0);
  }

  reserveSeats(numSeats: number, startSeat: number): void {
    for (let seat = startSeat; seat < startSeat + numSeats; seat++) {
      this.rows[Math.floor(seat / this.seatsPerRow)].seats[
        seat % this.seatsPerRow
      ] = 1;
    }
  }
}
