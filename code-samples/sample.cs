// C# sample: namespaces, records, attributes, LINQ, async, and pattern matching
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Klang.ThemeSamples;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class PreviewAttribute(string name) : Attribute
{
    public string Name { get; } = name;
}

public enum InvoiceState
{
    Draft,
    Sent,
    Paid,
    Overdue
}

public sealed record Invoice(Guid Id, string Customer, decimal Total, InvoiceState State);

[Preview("billing")]
public sealed class InvoiceReporter
{
    public async Task<IReadOnlyDictionary<InvoiceState, decimal>> SumByStateAsync(IEnumerable<Invoice> invoices)
    {
        await Task.Delay(TimeSpan.FromMilliseconds(10));

        return invoices
            .Where(invoice => invoice.Total > 0m)
            .GroupBy(invoice => invoice.State)
            .ToDictionary(group => group.Key, group => group.Sum(invoice => invoice.Total));
    }

    public static string Format(Invoice invoice) => invoice.State switch
    {
        InvoiceState.Paid => $"Paid: {invoice.Customer} ({invoice.Total:C})",
        InvoiceState.Overdue when invoice.Total > 1000m => "Escalate overdue invoice",
        _ => "No action required"
    };
}
