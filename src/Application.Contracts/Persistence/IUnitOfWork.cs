namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IUnitOfWork
{
    // Execute the provided action inside a transaction. Implementations should ensure atomicity.
    Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default);
}
