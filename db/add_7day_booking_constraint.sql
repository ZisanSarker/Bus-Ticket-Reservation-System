-- Migration: Add 7-day advance booking constraint
-- This ensures tickets can only be booked for dates within 7 days from today

-- Add a check constraint to BusSchedules table to prevent schedules beyond 7 days
-- Note: PostgreSQL check constraints are evaluated at insert/update time
-- For runtime enforcement, the application layer (BookingService.cs) handles this

-- Add a helper function to validate booking date
CREATE OR REPLACE FUNCTION validate_booking_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if journey date is more than 7 days in the future
    IF NEW."JourneyDate" > CURRENT_DATE + INTERVAL '7 days' THEN
        RAISE EXCEPTION 'Journey date cannot be more than 7 days in advance from today';
    END IF;Please create the HTML and CSS for a two-column bus ticket booking interface that precisely matches the provided image.

Overall Layout:

    The interface is split into two main columns. The left column is for seat selection, and the right column is for booking details and a form.

    At the very top, spanning both columns, create a horizontal legend.

Top Legend:

    The legend should display different seat statuses with a small seat icon and text for each.

    The statuses and their colors are:

        BOOKED (M): Purple

        BOOKED (F): Pink

        BLOCKED: Dark Grey

        AVAILABLE: Light Grey / White outline

        SELECTED: Green

        SOLD (M): Red

        SOLD (F): Magenta / Dark Pink

Left Column (Seat Selection):

    This column contains a visual grid of bus seats.

    The layout of the seats should be in rows, with a 2-seat, aisle, 2-seat configuration (two seats on the left, an aisle in the middle, and two seats on the right).

    The seat icons should be styled to match the legend. For example, show some seats as "AVAILABLE" (light grey), some as "BOOKED" (purple), and one as "SELECTED" (green), just like in the image.

Right Column (Booking Form):

    Boarding/Dropping Section:

        Start with a label "BOARDING/DROPPING:".

        Add a dropdown menu labeled "BOARDING POINT*" which is pre-selected with a value like "[06:00 AM] Kallyanpur counter".

        Add a second dropdown menu labeled "DROPPING POINT*" with a placeholder "Select dropping point". This dropdown should have a red border, indicating it is required.

    Fare Details Section:

        Below the dropdowns, display a price breakdown:

            "Seat Fare: [Price]"

            "Service Charge: [Price]"

            "PGW Charge: [Price]"

            "Total Discount: [Price]"

        The "Service Charge," "PGW Charge," and "Total Discount" lines should be styled with green text.

    Form Input Section:

        Add an input field with the label "MOBILE NUMBER*".

        Add a large, solid red "SUBMIT" button below the mobile number field.

    Footer Text:

        Include the text: "I have already verified my phone number, and have a password. Login with password. Click here" (where "Click here" is a link).

        Below that, include the text: "By logging in you are agreeing to the Terms & Conditions and Privacy Notice of bdtickets" (where "Terms & Conditions" and "Privacy Notice" are links).
    
    -- Check if journey date is in the past
    IF NEW."JourneyDate" < CURRENT_DATE THEN
        RAISE EXCEPTION 'Journey date cannot be in the past';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for BusSchedules table
DROP TRIGGER IF EXISTS check_booking_date_trigger ON "BusSchedules";
CREATE TRIGGER check_booking_date_trigger
    BEFORE INSERT OR UPDATE ON "BusSchedules"
    FOR EACH ROW
    EXECUTE FUNCTION validate_booking_date();

-- Add a comment to document the constraint
COMMENT ON FUNCTION validate_booking_date() IS 'Validates that bus schedules are within 7-day advance booking window';

-- Create an index on JourneyDate for better query performance
CREATE INDEX IF NOT EXISTS "IX_BusSchedules_JourneyDate" ON "BusSchedules" ("JourneyDate");

-- Insert into migrations history
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251027000000_Add7DayBookingConstraint', '9.0.10')
ON CONFLICT ("MigrationId") DO NOTHING;
