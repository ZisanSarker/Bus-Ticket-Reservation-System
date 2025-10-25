namespace BusReservationSystem.Application.Contracts.Exceptions;

public class NotFoundException : Exception
{
    public string Resource { get; }
    public string? Key { get; }

    public NotFoundException(string resource, string? key = null)
        : base(key is null ? $"{resource} not found" : $"{resource} '{key}' not found")
    {
        Resource = resource;
        Key = key;
    }
}
