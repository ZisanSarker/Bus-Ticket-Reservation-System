CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "Buses" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "CompanyName" character varying(150) NOT NULL,
        "TotalSeats" integer NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Buses" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "BusSchedules" (
        "Id" uuid NOT NULL,
        "BusId" uuid NOT NULL,
        "RouteId" uuid NOT NULL,
        "JourneyDate" date NOT NULL,
        "StartTime" time NOT NULL,
        "ArrivalTime" time NOT NULL,
        "Price" numeric(10,2) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_BusSchedules" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "Passengers" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "MobileNumber" character varying(20) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Passengers" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "Routes" (
        "Id" uuid NOT NULL,
        "FromCity" character varying(100) NOT NULL,
        "ToCity" character varying(100) NOT NULL,
        "DistanceKm" double precision NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Routes" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "Seats" (
        "Id" uuid NOT NULL,
        "BusId" uuid NOT NULL,
        "SeatNumber" integer NOT NULL,
        "Row" integer NOT NULL,
        "Status" integer NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Seats" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE TABLE "Tickets" (
        "Id" uuid NOT NULL,
        "PassengerId" uuid NOT NULL,
        "BusScheduleId" uuid NOT NULL,
        "SeatId" uuid NOT NULL,
        "BookingTime" timestamp with time zone NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Tickets" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_Buses_CompanyName_Name" ON "Buses" ("CompanyName", "Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_BusSchedules_BusId" ON "BusSchedules" ("BusId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_BusSchedules_RouteId_JourneyDate" ON "BusSchedules" ("RouteId", "JourneyDate");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_Passengers_MobileNumber" ON "Passengers" ("MobileNumber");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Routes_FromCity_ToCity" ON "Routes" ("FromCity", "ToCity");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_Seats_BusId" ON "Seats" ("BusId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Seats_BusId_SeatNumber" ON "Seats" ("BusId", "SeatNumber");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Tickets_BusScheduleId_SeatId" ON "Tickets" ("BusScheduleId", "SeatId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    CREATE INDEX "IX_Tickets_PassengerId" ON "Tickets" ("PassengerId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251025080027_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251025080027_InitialCreate', '9.0.10');
    END IF;
END $EF$;
COMMIT;

