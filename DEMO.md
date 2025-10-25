# Demo Video Guide (3–5 minutes)

Use this outline to record a concise demo that covers architecture, end-to-end flow, and tests.

## 1) Clean Architecture overview (~1 min)
- Walk through `/src` layers: Domain → Application → Application.Contracts → Infrastructure → WebApi → ClientApp
- Point to key folders/files:
  - Domain: `src/Domain/Entities`, `src/Domain/ValueObjects`
  - Application: `src/Application/Services`, `src/Application.Contracts/Services`
  - Infrastructure: `src/Infrastructure/Data` (DbContext, Migrations), `src/Infrastructure/Persistence` (Repositories)
  - WebApi: `src/WebApi/Controllers` (Search, Booking), `src/WebApi/Program.cs` (CORS, Swagger, seeding)
  - ClientApp: `src/ClientApp/src/app` (components, services)

## 2) Full workflow demo (~2–3 min)
- Start the API (HTTP port 5000):
  - `ASPNETCORE_URLS=http://localhost:5000 dotnet run --project src/WebApi/BusReservationSystem.WebApi.csproj`
- Start Angular dev server:
  - `cd src/ClientApp && npm start` (http://localhost:4200)
- Walkthrough:
  1. Search: From "Dhaka" → To "Chittagong"; Journey Date: tomorrow
  2. Seat Plan: open a result, show available/occupied seats
  3. Booking: choose seats, fill passenger info, and submit
  4. Show success payload (ticket IDs and total price)

Note: DB seeds buses, routes, and schedules on first run.

## 3) Unit test run (~30–60 sec)
- Run tests: `dotnet test`
- Show tests passing in the terminal.

## Recording tips
- Use OBS Studio for screen capture, or a quick ffmpeg command:
  - Linux/macOS example:
    - `ffmpeg -f x11grab -r 30 -s 1920x1080 -i :0.0 -vcodec libx264 -preset veryfast -crf 23 demo.mp4`
- Increase terminal + editor font size; use a single column layout for clarity.
