package com.kien.vehicle.booking.exception;

import java.time.LocalDate;

public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
  public BookingConflictException(LocalDate start, LocalDate end) {
    super(String.format("Xe đã được đặt trong khoảng thời gian từ %s đến %s. Vui lòng chọn khoảng khác.", start, end));
  }
}
