export interface RouteStopDto {
  stopId: string;
  stopName: string;
  stopTime: string;
  distanceFromStart: number; // in km
  priceFromStart: number; // base price from origin
}

export interface RouteDetailsDto {
  routeId: string;
  fromCity: string;
  toCity: string;
  stops: RouteStopDto[];
}

export interface BoardingDroppingPointDto {
  boardingPointId: string;
  boardingPointName: string;
  boardingTime: string;
  droppingPointId: string;
  droppingPointName: string;
  droppingTime: string;
  seatFare: number;
  serviceCharge: number;
  totalPrice: number;
}
